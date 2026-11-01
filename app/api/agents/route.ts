import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/agents";

export const runtime = "nodejs";

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

  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "qwen2.5:3b";

  try {
    const response = await fetch(baseUrl + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: agent.systemPrompt + "\n\nEres un trabajador de una oficina virtual. Responde en español, con pasos concretos y entregables. No afirmes haber ejecutado acciones externas. Si te piden algo que requiere acceso a otras herramientas, explica que puedes preparar el trabajo pero necesitas una integración y aprobación humana." },
          ...safeHistory,
          { role: "user", content: message }
        ],
        options: { temperature: 0.35 }
      }),
      signal: AbortSignal.timeout(120000)
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Ollama respondió con el estado " + response.status + "." }, { status: 502 });
    }
    const data = await response.json() as { message?: { content?: string }; model?: string };
    const reply = data.message?.content?.trim();
    if (!reply) return NextResponse.json({ error: "El modelo no ha devuelto una respuesta." }, { status: 502 });
    return NextResponse.json({ reply, model: data.model || model, agent: agent.name });
  } catch {
    return NextResponse.json({
      error: "No se encuentra Ollama en este equipo. El chat de agentes funciona cuando Next.js y Ollama se ejecutan en el mismo ordenador."
    }, { status: 503 });
  }
}
