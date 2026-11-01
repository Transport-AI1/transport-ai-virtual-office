import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/lib/agents";

export const runtime = "nodejs";

const director = AGENTS.find((agent) => agent.id === "operations")!;

export async function POST(request: NextRequest) {
  let body: { brief?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El contenido de la solicitud no es válido." }, { status: 400 });
  }

  const brief = typeof body.brief === "string" ? body.brief.trim() : "";
  if (!brief) {
    return NextResponse.json({ error: "Escribe qué necesitas organizar." }, { status: 400 });
  }
  if (brief.length > 8000) {
    return NextResponse.json({ error: "El encargo supera el límite de 8.000 caracteres." }, { status: 400 });
  }

  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "qwen2.5:3b";

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: director.systemPrompt },
          { role: "user", content: brief }
        ],
        options: { temperature: 0.25 }
      }),
      signal: AbortSignal.timeout(120000)
    });

    if (!response.ok) {
      return NextResponse.json({ error: `El modelo local respondió con el estado ${response.status}.` }, { status: 502 });
    }

    const data = await response.json() as { message?: { content?: string }; model?: string };
    const plan = data.message?.content?.trim();
    if (!plan) {
      return NextResponse.json({ error: "El modelo no devolvió un plan. Inténtalo de nuevo." }, { status: 502 });
    }

    return NextResponse.json({ plan, model: data.model || model, agent: director.name });
  } catch (error) {
    const isConnectionError = error instanceof TypeError;
    const message = isConnectionError
      ? "No se encuentra Ollama en este equipo. Instálalo e inicia un modelo local para activar al Director de Operaciones."
      : "La petición al modelo local ha tardado demasiado o ha fallado. Comprueba que Ollama esté funcionando.";
    return NextResponse.json({ error: message, setup: "OLLAMA_NOT_AVAILABLE" }, { status: 503 });
  }
}
