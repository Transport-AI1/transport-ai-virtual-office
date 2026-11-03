import { NextRequest, NextResponse } from "next/server";
import { AGENT_SHARED_RULES, getAgent } from "@/lib/agents";

export const runtime = "nodejs";

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  model?: string;
  error?: { message?: string };
};

export async function POST(request: NextRequest) {
  let body: { agentId?: unknown; message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La solicitud no tiene un formato válido." }, { status: 400 });
  }

  const agentId = typeof body.agentId === "string" ? body.agentId : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const agent = getAgent(agentId);

  if (!agent) return NextResponse.json({ error: "No existe ese agente." }, { status: 404 });
  if (!message) return NextResponse.json({ error: "Escribe una instrucción para el agente." }, { status: 400 });
  if (message.length > 6000) return NextResponse.json({ error: "El mensaje supera los 6.000 caracteres." }, { status: 400 });

  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const safeHistory = history.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { role?: unknown; content?: unknown };
    if ((row.role !== "user" && row.role !== "assistant") || typeof row.content !== "string") return [];
    return [{ role: row.role, content: row.content.slice(0, 4000) }];
  });

  const baseUrl = (process.env.LOCAL_LLM_BASE_URL || process.env.GPT4ALL_BASE_URL || "http://127.0.0.1:4891/v1").replace(/\/$/, "");
  const model = process.env.LOCAL_LLM_MODEL || process.env.GPT4ALL_MODEL || "Llama 3.2 3B Instruct";

  try {
    const response = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: agent.systemPrompt + "\n\n" + AGENT_SHARED_RULES + "\n\nEres un trabajador de una oficina virtual. Responde en español, con pasos concretos y entregables. No afirmes haber ejecutado acciones externas. Si te piden algo que requiere acceso a otras herramientas, explica que puedes preparar el trabajo pero necesitas una integración y aprobación humana."
          },
          ...safeHistory,
          { role: "user", content: message }
        ],
        temperature: 0.3,
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
    const reply = typeof content === "string"
      ? content.trim()
      : Array.isArray(content)
        ? content.map((part) => part.text || "").join("\n").trim()
        : "";

    if (!reply) {
      return NextResponse.json({ error: "El servidor local no ha devuelto una respuesta. Comprueba que el modelo esté cargado." }, { status: 502 });
    }

    return NextResponse.json({ reply, model: data.model || model, agent: agent.name });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json({
      error: timedOut
        ? "El modelo local está tardando demasiado. Prueba con una instrucción más breve."
        : "No se puede conectar con el servidor local de IA. Comprueba que está iniciado y que la dirección configurada es correcta."
    }, { status: timedOut ? 504 : 503 });
  }
}
