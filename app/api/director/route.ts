import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/lib/agents";

export const runtime = "nodejs";

const director = AGENTS.find((agent) => agent.id === "operations")!;

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  model?: string;
};

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

  const baseUrl = (process.env.GPT4ALL_BASE_URL || "http://127.0.0.1:4891/v1").replace(/\/$/, "");
  const model = process.env.GPT4ALL_MODEL || "Llama 3.2 3B Instruct";

  try {
    const response = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: director.systemPrompt },
          { role: "user", content: brief }
        ],
        temperature: 0.25
      }),
      signal: AbortSignal.timeout(120000)
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return NextResponse.json({
        error: "GPT4All respondió con el estado " + response.status + (detail ? ": " + detail.slice(0, 300) : "")
      }, { status: 502 });
    }

    const data = await response.json() as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    const plan = typeof content === "string"
      ? content.trim()
      : Array.isArray(content)
        ? content.map((part) => part.text || "").join("\n").trim()
        : "";

    if (!plan) {
      return NextResponse.json({ error: "GPT4All no ha devuelto un plan. Comprueba que el modelo esté cargado." }, { status: 502 });
    }

    return NextResponse.json({ plan, model: data.model || model, agent: director.name });
  } catch {
    return NextResponse.json({
      error: "No se puede conectar con GPT4All en este equipo. Abre GPT4All, activa su API Server y comprueba que escucha en http://127.0.0.1:4891."
    }, { status: 503 });
  }
}
