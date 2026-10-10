/**
 * AWS Lambda Function: ClimaShift Task Understanding Microservice
 * Runtime: Node.js 20.x
 * Dependencies: @aws-sdk/client-bedrock-runtime (included in AWS Lambda Node.js 18+ or packaged)
 * 
 * Responsibilities:
 * 1. Receive natural-language work plan from API Gateway.
 * 2. Validate request.
 * 3. Invoke Amazon Bedrock (Claude 3.5 Sonnet / Haiku).
 * 4. Validate & parse Bedrock response into structured task JSON.
 * 5. Return HTTP 200 with structured task data or useful error.
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const REGION = process.env.AWS_REGION || 'us-east-1';
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-6';

const bedrockClient = new BedrockRuntimeClient({ region: REGION });

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key'
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  const startTime = Date.now();

  try {
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid JSON request payload' })
      };
    }

    const text = body?.text || body?.prompt;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Missing required field: "text" in request body' })
      };
    }

    const systemPrompt = `You are ClimaShift's AI Task Intake Engine for construction workforce safety.
Extract all work activities from the supervisor shift notes into structured JSON.
CRITICAL SAFETY RULE: You do NOT make regulatory decisions or declare safety compliance. You ONLY structure task characteristics.

Return JSON in this format:
{
  "tasks": [
    {
      "name": "Tower B Exterior Plastering",
      "location": "Tower B Facade",
      "workers": 8,
      "duration": 3,
      "indoorOutdoor": "outdoor",
      "dustPotential": "high",
      "intensity": "heavy",
      "movable": true,
      "priority": "high",
      "preferredStartTime": "11:00",
      "recommendedControls": ["N95 Respirators", "Misting spray"]
    }
  ]
}`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Extract structured construction tasks from:\n"""\n${text}\n"""`
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const bedrockResponse = await bedrockClient.send(command);
    const decoded = new TextDecoder().decode(bedrockResponse.body);
    const parsedData = JSON.parse(decoded);
    const responseText = parsedData?.content?.[0]?.text || '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Bedrock response did not contain a valid JSON block');
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        status: 'success',
        source: 'amazon-bedrock',
        modelId: MODEL_ID,
        tasks: result.tasks || [],
        latencyMs: Date.now() - startTime
      })
    };
  } catch (error) {
    console.error('Lambda Bedrock parsing error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        status: 'error',
        error: error.message || 'Error communicating with Amazon Bedrock',
        latencyMs: Date.now() - startTime
      })
    };
  }
};
