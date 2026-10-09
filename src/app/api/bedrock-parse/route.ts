import { NextRequest, NextResponse } from 'next/server';
import { executeBedrockTaskParsing, getBedrockConfig } from '@/lib/bedrockService';

export async function GET() {
  const config = getBedrockConfig();
  return NextResponse.json(config);
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

    const prompt = body.prompt || body.text;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing prompt/text in request body' }, 
        { status: 400 }
      );
    }

    const result = await executeBedrockTaskParsing(prompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/bedrock-parse:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message || 'Internal server error processing work plan'
      }, 
      { status: 500 }
    );
  }
}
