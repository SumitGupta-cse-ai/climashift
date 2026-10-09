import { Task } from '@/types';
import { parseWithDeterministicNLP, getStandardDemoTasks } from './deterministicNlp';

export interface ParseResult {
  tasks: Task[];
  source: 'amazon-bedrock-claude' | 'deterministic-nlp-fallback';
  rawPrompt: string;
  parsingLatencyMs: number;
  modelId?: string;
  isDemoFallback: boolean;
  statusMessage?: string;
}

export interface AwsBedrockStatus {
  configured: boolean;
  mode: 'live' | 'demo_fallback';
  region: string;
  modelId: string;
  message: string;
}

/**
 * Checks server-side AWS Bedrock connection status
 */
export async function checkAwsBedrockStatus(): Promise<AwsBedrockStatus> {
  try {
    const res = await fetch('/api/bedrock-parse', { method: 'GET', cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Unable to query Bedrock status endpoint:', err);
  }

  return {
    configured: false,
    mode: 'demo_fallback',
    region: 'us-east-1',
    modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    message: 'Demo / fallback mode — AWS Bedrock is not currently connected.'
  };
}

/**
 * Parses natural-language shift notes into structured tasks
 * Calls backend API route (or API Gateway endpoint if configured)
 * Truthfully labels output as Amazon Bedrock or Deterministic Demo Fallback
 */
export async function parseWorkPlanPrompt(promptText: string): Promise<ParseResult> {
  const startTime = Date.now();

  // If a custom API Gateway URL is set via environment, use it; otherwise use local API route
  const apiEndpoint = process.env.NEXT_PUBLIC_API_GATEWAY_URL || '/api/parse-work-plan';

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: promptText, prompt: promptText })
    });

    if (response.ok) {
      const data = await response.json();

      if (data.status === 'success' && data.source === 'amazon-bedrock') {
        return {
          tasks: data.tasks,
          source: 'amazon-bedrock-claude',
          rawPrompt: promptText,
          parsingLatencyMs: data.latencyMs || (Date.now() - startTime),
          modelId: data.modelId || 'anthropic.claude-3-5-sonnet-20240620-v1:0',
          isDemoFallback: false,
          statusMessage: 'Structured by Amazon Bedrock (Claude 3.5 Sonnet)'
        };
      }

      // Truthfully handle server-side demo fallback response
      if (data.tasks && Array.isArray(data.tasks)) {
        return {
          tasks: data.tasks,
          source: 'deterministic-nlp-fallback',
          rawPrompt: promptText,
          parsingLatencyMs: data.latencyMs || (Date.now() - startTime),
          isDemoFallback: true,
          statusMessage: data.message || 'Demo / fallback mode — AWS Bedrock credentials not connected.'
        };
      }
    }
  } catch (err) {
    console.warn('Network call to AWS endpoint failed, falling back to local NLP engine:', err);
  }

  // Resilient client-side fallback if network or endpoint fails
  const fallbackTasks = parseWithDeterministicNLP(promptText);
  return {
    tasks: fallbackTasks,
    source: 'deterministic-nlp-fallback',
    rawPrompt: promptText,
    parsingLatencyMs: Date.now() - startTime,
    isDemoFallback: true,
    statusMessage: 'Demo / fallback mode — AWS Bedrock is not currently connected. Using deterministic task parser.'
  };
}

export { getStandardDemoTasks };
