import { NextRequest, NextResponse } from "next/server";
import { AGENTS, AGENT_SHARED_RULES } from "@/lib/agents";

export const runtime = "nodejs";

const director = AGENTS.find((agent) => agent.id === "operations")!;

type ChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: { content?: string | Array<{ type?: string; text?: string }> };
  }>;
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

  const baseUrl = (process.env.LOCAL_LLM_BASE_URL || process.env.GPT4ALL_BASE_URL || "http://127.0.0.1:4891/v1").replace(/\/$/, "");
  const model = process.env.LOCAL_LLM_MODEL || process.env.GPT4ALL_MODEL || "Llama 3.2 3B Instruct";

  try {
    const response = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        max_tokens: 650,
        messages: [
          {
            role: "system",
            content: director.systemPrompt + "\n\n" + AGENT_SHARED_RULES +
              "\n\nINSTRUCCIÓN ESPECIAL PARA ESTE ENCARGO: entrega un plan completo y legible. Incluye entre 3 y 5 tareas prioritarias. Para cada una indica responsable, prioridad, acción principal y entregable verificable. Usa frases breves y evita introducciones largas para que el plan pueda generarse en un equipo local."
          },
          { role: "user", content: brief }
        ],
        temperature: 0.2,
        top_p: 0.9
      }),
      signal: AbortSignal.timeout(240000)
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return NextResponse.json({
        error: "El servidor local respondió con el estado " + response.status + (detail ? ": " + detail.slice(0, 300) : "")
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
      return NextResponse.json({ error: "El servidor local no ha devuelto un plan. Comprueba que el modelo esté cargado." }, { status: 502 });
    }

    return NextResponse.json({
      plan,
      model: data.model || model,
      agent: director.name,
      truncated: data.choices?.[0]?.finish_reason === "length"
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json({
      error: timedOut
        ? "El modelo local está tardando demasiado en generar el plan. Prueba con un encargo más breve o un modelo local más rápido."
        : "No se puede conectar con el servidor local de IA. Comprueba que está iniciado y que la dirección configurada es correcta."
    }, { status: timedOut ? 504 : 503 });
  }
}
