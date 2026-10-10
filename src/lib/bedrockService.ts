import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Task } from '@/types';
import { TASK_HEURISTICS, getStandardDemoTasks, parseWithDeterministicNLP } from './deterministicNlp';
import https from 'https';

export interface BedrockStatusResponse {
  configured: boolean;
  mode: 'live' | 'demo_fallback';
  authMethod: 'api_key_bearer' | 'iam_sigv4' | 'none';
  region: string;
  modelId: string;
  message: string;
}

export interface BedrockParseResponse {
  status: 'success' | 'demo_fallback' | 'error';
  source: 'amazon-bedrock' | 'deterministic-fallback';
  authMethod?: 'api_key_bearer' | 'iam_sigv4' | 'none';
  modelId?: string;
  message?: string;
  tasks: Task[];
  rawPrompt: string;
  latencyMs: number;
}

/**
 * Returns the configured Bedrock bearer token / API key, if present.
 * Looks for AWS_BEARER_TOKEN_BEDROCK (standard) or AWS_BEDROCK_API_KEY.
 */
export function getBedrockBearerToken(): string | null {
  const token = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.AWS_BEDROCK_API_KEY;
  return token && token.trim().length > 0 ? token.trim() : null;
}

/**
 * Determines which authentication mechanism is currently configured.
 * - 'api_key_bearer': API key configured via AWS_BEARER_TOKEN_BEDROCK (does NOT require access/secret keys)
 * - 'iam_sigv4': IAM access keys configured via AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
 * - 'none': No credentials detected; uses truthful local fallback.
 */
export function getBedrockAuthMethod(): 'api_key_bearer' | 'iam_sigv4' | 'none' {
  if (getBedrockBearerToken()) {
    return 'api_key_bearer';
  }
  if (
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
  ) {
    return 'iam_sigv4';
  }
  return 'none';
}

/**
 * Checks if live AWS Bedrock credentials, bearer token, or IAM role are present.
 */
export function isAwsBedrockConfigured(): boolean {
  return getBedrockAuthMethod() !== 'none';
}

export const DEFAULT_BEDROCK_MODEL_ID = 'us.anthropic.claude-sonnet-4-6';

/**
 * Resolves the Bedrock model identifier.
 * Upgrades deprecated/EOL models (such as claude-3-5-sonnet-20240620-v1:0) to Claude Sonnet 4.6.
 */
export function getResolvedModelId(): string {
  const configured = process.env.BEDROCK_MODEL_ID?.trim();
  if (!configured || configured === 'anthropic.claude-3-5-sonnet-20240620-v1:0') {
    return DEFAULT_BEDROCK_MODEL_ID;
  }
  return configured;
}

/**
 * Returns current Bedrock status and connection metadata.
 */
export function getBedrockConfig(): BedrockStatusResponse {
  const configured = isAwsBedrockConfigured();
  const authMethod = getBedrockAuthMethod();
  const region = process.env.AWS_REGION || 'us-east-1';
  const modelId = getResolvedModelId();

  let message = 'Demo / fallback mode — AWS Bedrock credentials not connected.';
  if (configured) {
    if (authMethod === 'api_key_bearer') {
      message = `AWS Bedrock connected via API Key (Bearer token, ${modelId} in ${region})`;
    } else {
      message = `AWS Bedrock connected via IAM credentials (${modelId} in ${region})`;
    }
  }

  return {
    configured,
    mode: configured ? 'live' : 'demo_fallback',
    authMethod,
    region,
    modelId,
    message
  };
}

/**
 * Sanitizes errors to ensure API keys, tokens, or raw secrets are never leaked.
 */
function sanitizeError(error: any): string {
  const raw = error?.message || String(error);
  if (raw.includes('Operation not allowed')) {
    return 'Bedrock HTTP 400: Operation not allowed — Anthropic Claude model access has not yet been granted in your Amazon Bedrock Console (Bedrock > Model access > Request access to Anthropic Claude).';
  }
  if (raw.includes('account is currently being verified')) {
    return 'Bedrock HTTP 403: AWS account is currently being verified by Amazon Web Services. Model invocation is temporarily blocked until account verification completes.';
  }
  return raw
    .replace(/(Bearer\s+)[A-Za-z0-9_\-\.]+/gi, '$1[REDACTED]')
    .replace(/([A-Za-z0-9_\-]{24,})/g, (match: string) => {
      if (match.includes('anthropic') || match.includes('claude') || match.includes('bedrock') || match.includes('titan') || match.includes('sonnet')) {
        return match;
      }
      return '[REDACTED]';
    });
}

/**
 * Creates the Claude 3.5 Sonnet payload for structured task extraction.
 */
function buildClaudeTaskIntakePayload(promptText: string) {
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
      "duration": 3,
      "indoorOutdoor": "outdoor" | "indoor" | "semi-indoor",
      "dustPotential": "high" | "moderate" | "low" | "none",
      "intensity": "heavy" | "moderate" | "light",
      "movable": true,
      "priority": "critical" | "high" | "normal" | "low",
      "preferredStartTime": "11:00",
      "recommendedControls": ["N95 Respirators", "Water misting spray"]
    }
  ]
}`;

  return {
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
}

/**
 * Normalizes raw Bedrock response into validated ClimaShift Task array.
 */
function extractAndNormalizeTasks(parsedBedrock: any): Task[] {
  const responseText = parsedBedrock?.content?.[0]?.text || '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Bedrock response did not contain valid JSON structure');
  }

  const taskData = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(taskData.tasks) || taskData.tasks.length === 0) {
    throw new Error('Bedrock returned empty task array');
  }

  return taskData.tasks.map((raw: any, idx: number): Task => {
    const duration = Math.min(8, Math.max(1, parseInt(raw.duration, 10) || 2));
    const preferredStart = raw.preferredStartTime && /^\d{2}:\d{2}$/.test(raw.preferredStartTime)
      ? raw.preferredStartTime
      : '09:00';
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
}

/**
 * Invokes Amazon Bedrock Runtime via HTTPS using AWS_BEARER_TOKEN_BEDROCK API key.
 * Does NOT require AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY.
 * Includes automatic TLS certificate retry for Windows/proxy development environments.
 */
async function invokeBedrockWithBearerToken(
  token: string,
  region: string,
  modelId: string,
  payload: any
): Promise<any> {
  const url = `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/invoke`;
  const postData = JSON.stringify(payload);

  const makeRequest = (rejectUnauthorized: boolean): Promise<any> => {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);

      const options: https.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Length': Buffer.byteLength(postData)
        },
        rejectUnauthorized
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error('Invalid JSON received from Bedrock Runtime'));
            }
          } else {
            try {
              const errObj = JSON.parse(data);
              const msg = errObj.message || errObj.Message || data;
              reject(new Error(`Bedrock HTTP ${res.statusCode}: ${msg}`));
            } catch {
              reject(new Error(`Bedrock HTTP ${res.statusCode}: ${data.slice(0, 150)}`));
            }
          }
        });
      });

      req.on('error', (err: any) => {
        // If TLS certificate verification error occurs on development/Windows machines, retry once with bypass
        if (rejectUnauthorized && (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.message?.includes('unable to verify the first certificate'))) {
          makeRequest(false).then(resolve).catch(reject);
          return;
        }
        reject(new Error(`Network error invoking Bedrock: ${err.message}`));
      });

      req.setTimeout(35000, () => {
        req.destroy();
        reject(new Error('Timeout after 35s invoking Bedrock'));
      });

      req.write(postData);
      req.end();
    });
  };

  const initialRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';
  return makeRequest(initialRejectUnauthorized);
}

/**
 * Invokes Amazon Bedrock Runtime via AWS SDK using IAM SigV4 credentials.
 */
async function invokeBedrockWithSigV4(
  region: string,
  modelId: string,
  payload: any
): Promise<any> {
  const client = new BedrockRuntimeClient({
    region,
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN
    } : undefined
  });

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const decoded = new TextDecoder().decode(response.body);
  return JSON.parse(decoded);
}

/**
 * Executes authentic Amazon Bedrock invocation using Claude Sonnet 4.6.
 * Automatically chooses:
 * 1. API Key Bearer Token (AWS_BEARER_TOKEN_BEDROCK)
 * 2. IAM SigV4 Credentials (AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY)
 * 3. Truthful Local Fallback (Deterministic NLP engine)
 */
export async function executeBedrockTaskParsing(promptText: string): Promise<BedrockParseResponse> {
  const startTime = Date.now();
  const region = process.env.AWS_REGION || 'us-east-1';
  const modelId = getResolvedModelId();
  const authMethod = getBedrockAuthMethod();
  const bearerToken = getBedrockBearerToken();

  // If no credentials or API key configured, use transparent deterministic fallback
  if (authMethod === 'none') {
    const fallbackTasks = parseWithDeterministicNLP(promptText);
    return {
      status: 'demo_fallback',
      source: 'deterministic-fallback',
      authMethod: 'none',
      modelId,
      message: 'AWS Bedrock credentials not detected. Executed using local deterministic NLP parser.',
      tasks: fallbackTasks,
      rawPrompt: promptText,
      latencyMs: Date.now() - startTime
    };
  }

  const payload = buildClaudeTaskIntakePayload(promptText);

  try {
    let parsedBedrockResponse: any;

    if (authMethod === 'api_key_bearer' && bearerToken) {
      parsedBedrockResponse = await invokeBedrockWithBearerToken(bearerToken, region, modelId, payload);
    } else {
      parsedBedrockResponse = await invokeBedrockWithSigV4(region, modelId, payload);
    }

    const normalizedTasks = extractAndNormalizeTasks(parsedBedrockResponse);

    return {
      status: 'success',
      source: 'amazon-bedrock',
      authMethod,
      modelId,
      tasks: normalizedTasks,
      rawPrompt: promptText,
      latencyMs: Date.now() - startTime
    };
  } catch (error: any) {
    const safeMsg = sanitizeError(error);
    console.error('Amazon Bedrock invocation error, using truthful fallback:', safeMsg);
    const fallbackTasks = parseWithDeterministicNLP(promptText);
    return {
      status: 'demo_fallback',
      source: 'deterministic-fallback',
      authMethod,
      modelId,
      message: `Amazon Bedrock call failed (${safeMsg}). Using deterministic NLP fallback.`,
      tasks: fallbackTasks,
      rawPrompt: promptText,
      latencyMs: Date.now() - startTime
    };
  }
}
