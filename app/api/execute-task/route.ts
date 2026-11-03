import { NextRequest, NextResponse } from "next/server";
import { AGENTS, AGENT_SHARED_RULES } from "@/lib/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  model?: string;
};

export async function POST(request: NextRequest) {
  let body: { owner?: unknown; title?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La solicitud no tiene un formato válido." }, { status: 400 });
  }

  const owner = typeof body.owner === "string" ? body.owner.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const agent = AGENTS.find((item) => item.name === owner);

  if (!agent) return NextResponse.json({ error: "No se ha encontrado el especialista asignado." }, { status: 404 });
  if (!title) return NextResponse.json({ error: "La tarea está vacía." }, { status: 400 });
  if (title.length > 3000) return NextResponse.json({ error: "La tarea supera los 3.000 caracteres." }, { status: 400 });

  const baseUrl = (process.env.LOCAL_LLM_BASE_URL || process.env.GPT4ALL_BASE_URL || "http://127.0.0.1:4891/v1").replace(/\/$/, "");
  const model = process.env.LOCAL_LLM_MODEL || process.env.GPT4ALL_MODEL || "Llama 3.2 3B Instruct";

  try {
    const response = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        max_tokens: 750,
        temperature: 0.25,
        top_p: 0.9,
        messages: [
          {
            role: "system",
            content: agent.systemPrompt + "\n\n" + AGENT_SHARED_RULES +
              "\n\nMODO DE EJECUCIÓN AUTÓNOMA: has recibido una tarea asignada por el Director. No te limites a explicar cómo la harías: realiza ahora el trabajo intelectual que puedas completar con el contexto y las herramientas realmente disponibles. Produce un entregable concreto, útil y revisado. No inventes datos ni simules búsquedas, contactos, envíos, publicaciones, pruebas o cambios externos. Si una parte requiere acceso externo, déjala claramente identificada como pendiente de integración o aprobación. Termina con RESULTADO, ENTREGABLE, BLOQUEOS y SIGUIENTE PASO. Responde en español."
          },
          { role: "user", content: "EJECUTA ESTA TAREA:\n" + title }
        ]
      }),
      signal: AbortSignal.timeout(180000)
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return NextResponse.json({
        error: "El motor local respondió con el estado " + response.status + (detail ? ": " + detail.slice(0, 250) : "")
      }, { status: 502 });
    }

    const data = await response.json() as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    const result = typeof content === "string"
      ? content.trim()
      : Array.isArray(content)
        ? content.map((part) => part.text || "").join("\n").trim()
        : "";

    if (!result) return NextResponse.json({ error: "El modelo no ha generado un entregable. Comprueba que está cargado." }, { status: 502 });

    return NextResponse.json({ result, model: data.model || model, agent: agent.name });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json({
      error: timedOut
        ? "El especialista ha agotado el tiempo de ejecución. Prueba con una tarea más breve."
        : "No se puede conectar con el motor local. Comprueba que GPT4All esté abierto y que el modelo esté cargado."
    }, { status: timedOut ? 504 : 503 });
  }
}
