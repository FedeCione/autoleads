import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { checkOrigin } from '@/lib/cors';
import { leadRequestSchema, aiOutputSchema } from '@/lib/leadSchema';
import { buildMessages } from '@/lib/leadPrompt';

const DEMO_REPLY = {
  operacion: 'venta',
  tipo_propiedad: 'departamento',
  presupuesto: 'USD 100.000 - 130.000',
  zona: 'Palermo',
  ambientes: '2 ambientes',
  intencion: 'Busca depto para comprar en Palermo (modo demo)',
  prioridad: 'alta' as const,
  score: 85,
  razon_score: 'Demo mode — configura GROQ_API_KEY para resultados reales',
  respuesta_sugerida:
    '[DEMO MODE] Configura GROQ_API_KEY en las variables de entorno para activar el procesamiento real con IA.',
};

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'rate_limited', resetIn: rate.resetIn },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ result: DEMO_REPLY });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: buildMessages(parsed.data.lead),
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      console.error('[autoleads] Empty response from Groq');
      return NextResponse.json(
        { error: 'processing_failed', detail: 'empty_response' },
        { status: 503 },
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      console.error('[autoleads] JSON parse failed. Raw:', content);
      return NextResponse.json(
        { error: 'processing_failed', detail: 'invalid_json' },
        { status: 503 },
      );
    }

    const validated = aiOutputSchema.safeParse(json);
    if (!validated.success) {
      console.error('[autoleads] Zod validation failed:', JSON.stringify(validated.error.issues));
      console.error('[autoleads] AI output was:', JSON.stringify(json));
      return NextResponse.json(
        { error: 'processing_failed', detail: 'validation_failed' },
        { status: 503 },
      );
    }

    return NextResponse.json({ result: validated.data });
  } catch (err) {
    console.error('[autoleads] Groq call failed:', err);
    return NextResponse.json(
      { error: 'processing_failed', detail: 'groq_error' },
      { status: 503 },
    );
  }
}
