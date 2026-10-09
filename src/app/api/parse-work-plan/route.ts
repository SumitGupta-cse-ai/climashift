import { NextRequest, NextResponse } from 'next/server';
import { executeBedrockTaskParsing, getBedrockConfig } from '@/lib/bedrockService';

export async function GET() {
  const config = getBedrockConfig();
  return NextResponse.json({
    endpoint: '/api/parse-work-plan',
    apiGatewayCompatible: true,
    ...config
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        body = await req.json();
      } else {
        const raw = await req.text();
        try {
          body = JSON.parse(raw);
        } catch {
          body = { text: raw };
        }
      }
    } catch {
      const raw = await req.text();
      body = { text: raw };
    }

    const text = body.text || body.prompt || body.transcript;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required field "text", "prompt", or "transcript" in request body' }, 
        { status: 400 }
      );
    }

    const result = await executeBedrockTaskParsing(text);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/parse-work-plan:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message || 'Internal error'
      }, 
      { status: 500 }
    );
  }
}
