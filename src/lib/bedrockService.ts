import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Task } from '@/types';
import { TASK_HEURISTICS, getStandardDemoTasks, parseWithDeterministicNLP } from './deterministicNlp';

export interface BedrockStatusResponse {
  configured: boolean;
  mode: 'live' | 'demo_fallback';
  region: string;
  modelId: string;
  message: string;
}

export interface BedrockParseResponse {
  status: 'success' | 'demo_fallback' | 'error';
  source: 'amazon-bedrock' | 'deterministic-fallback';
  modelId?: string;
  message?: string;
  tasks: Task[];
  rawPrompt: string;
  latencyMs: number;
}

/**
 * Checks if live AWS Bedrock credentials or execution roles are present
 */
export function isAwsBedrockConfigured(): boolean {
  return Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI ||
    process.env.AWS_BEDROCK_API_KEY
  );
}

export function getBedrockConfig(): BedrockStatusResponse {
  const configured = isAwsBedrockConfigured();
  const region = process.env.AWS_REGION || 'us-east-1';
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0';

  return {
    configured,
    mode: configured ? 'live' : 'demo_fallback',
    region,
    modelId,
    message: configured 
      ? `AWS Bedrock connected (${modelId} in ${region})` 
      : 'Demo / fallback mode — AWS Bedrock credentials not connected.'
  };
}

/**
 * Executes authentic Amazon Bedrock invocation using Claude 3.5 Sonnet
 * Falls back transparently and TRUTHFULLY to deterministic NLP parser if AWS is not configured.
 */
export async function executeBedrockTaskParsing(promptText: string): Promise<BedrockParseResponse> {
  const startTime = Date.now();
  const region = process.env.AWS_REGION || 'us-east-1';
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0';

  if (!isAwsBedrockConfigured()) {
    // Truthful fallback when credentials aren't provided
    const fallbackTasks = parseWithDeterministicNLP(promptText);
    return {
      status: 'demo_fallback',
      source: 'deterministic-fallback',
      message: 'AWS Bedrock credentials not detected. Executed using local deterministic NLP parser.',
      tasks: fallbackTasks,
      rawPrompt: promptText,
      latencyMs: Date.now() - startTime
    };
  }

  try {
    const client = new BedrockRuntimeClient({
      region,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
      } : undefined
    });

    const systemInstruction = `You are ClimaShift's AI Task Intake Engine for construction workforce safety.
Your ONLY role is to parse natural-language work shift descriptions (English or Hindi/Hinglish) into structured task objects.
CRITICAL SAFETY RULE: You do NOT make safety decisions, regulatory compliance rulings, or medical declarations. You only structure work attributes for ClimaShift's deterministic constraint solver.

Return ONLY a valid JSON object with the following schema:
{
  "tasks": [
    {
      "name": "Concise Activity Name (e.g. Tower B Exterior Plastering)",
      "location": "Site Location or Area (e.g. Tower B Facade, Basement Level -1)",
      "workers": 8,
      "duration": 3, // Estimated hours (1 to 8)
      "indoorOutdoor": "outdoor" | "indoor" | "semi-indoor",
      "dustPotential": "high" | "moderate" | "low" | "none",
      "intensity": "heavy" | "moderate" | "light",
      "movable": true, // Whether task can be shifted to a lower-risk environmental window
      "priority": "critical" | "high" | "normal" | "low",
      "preferredStartTime": "11:00", // 24-hr format HH:MM
      "recommendedControls": ["N95 Respirators", "Water misting spray"]
    }
  ]
}`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
      temperature: 0.1,
      system: systemInstruction,
      messages: [
        {
          role: "user",
          content: `Extract structured construction tasks from this supervisor log:\n"""\n${promptText}\n"""`
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const parsedBedrock = JSON.parse(decoded);
    
    // Extract text from Claude 3 / 3.5 response
    const responseText = parsedBedrock?.content?.[0]?.text || '';
    
    // Extract JSON block
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Bedrock response did not contain valid JSON structure');
    }

    const taskData = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(taskData.tasks) || taskData.tasks.length === 0) {
      throw new Error('Bedrock returned empty task array');
    }

    // Normalize tasks into standard ClimaShift Task schema
    const normalizedTasks: Task[] = taskData.tasks.map((raw: any, idx: number) => {
      const duration = Math.min(8, Math.max(1, parseInt(raw.duration, 10) || 2));
      const preferredStart = raw.preferredStartTime && /^\d{2}:\d{2}$/.test(raw.preferredStartTime) ? raw.preferredStartTime : '09:00';
      const startH = parseInt(preferredStart.split(':')[0], 10) || 9;
      const endH = Math.min(19, startH + duration);
      const endStr = `${endH.toString().padStart(2, '0')}:00`;

      return {
        id: `task-bedrock-${Date.now().toString().slice(-4)}-${idx + 1}`,
        name: raw.name || `Task ${idx + 1}`,
        location: raw.location || 'Site Perimeter',
        workers: parseInt(raw.workers, 10) || 6,
        duration,
        indoorOutdoor: ['indoor', 'outdoor', 'semi-indoor'].includes(raw.indoorOutdoor) ? raw.indoorOutdoor : 'outdoor',
        dustPotential: ['high', 'moderate', 'low', 'none'].includes(raw.dustPotential) ? raw.dustPotential : 'moderate',
        intensity: ['heavy', 'moderate', 'light'].includes(raw.intensity) ? raw.intensity : 'moderate',
        airExposure: raw.indoorOutdoor === 'outdoor' ? 'high' : (raw.indoorOutdoor === 'semi-indoor' ? 'moderate' : 'low'),
        heatExposure: raw.indoorOutdoor === 'outdoor' ? 'high' : 'low',
        movable: typeof raw.movable === 'boolean' ? raw.movable : true,
        priority: ['critical', 'high', 'normal', 'low'].includes(raw.priority) ? raw.priority : 'normal',
        dependencies: Array.isArray(raw.dependencies) ? raw.dependencies : [],
        preferredStartTime: preferredStart,
        originalStartTime: preferredStart,
        originalEndTime: endStr,
        status: 'continue',
        recommendedControls: Array.isArray(raw.recommendedControls) && raw.recommendedControls.length > 0 
          ? raw.recommendedControls 
          : ['Standard Hardhat', 'Dust Respirator']
      };
    });

    return {
      status: 'success',
      source: 'amazon-bedrock',
      modelId,
      tasks: normalizedTasks,
      rawPrompt: promptText,
      latencyMs: Date.now() - startTime
    };
  } catch (error: any) {
    console.error('Amazon Bedrock invocation error, using truthful fallback:', error);
    const fallbackTasks = parseWithDeterministicNLP(promptText);
    return {
      status: 'demo_fallback',
      source: 'deterministic-fallback',
      message: `Amazon Bedrock call failed (${error.message || 'Network/Auth'}). Using deterministic NLP fallback.`,
      tasks: fallbackTasks,
      rawPrompt: promptText,
      latencyMs: Date.now() - startTime
    };
  }
}
