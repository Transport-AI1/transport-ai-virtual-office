import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = (
    process.env.LOCAL_LLM_BASE_URL ||
    process.env.GPT4ALL_BASE_URL ||
    "http://127.0.0.1:4891/v1"
  ).replace(/\/$/, "");
  const configuredModel =
    process.env.LOCAL_LLM_MODEL ||
    process.env.GPT4ALL_MODEL ||
    "Llama 3.2 3B Instruct";

  try {
    const accessHeaders: Record<string, string> = {};
    if (process.env.LLM_ACCESS_CLIENT_ID && process.env.LLM_ACCESS_CLIENT_SECRET) {
      accessHeaders["CF-Access-Client-Id"] = process.env.LLM_ACCESS_CLIENT_ID;
      accessHeaders["CF-Access-Client-Secret"] = process.env.LLM_ACCESS_CLIENT_SECRET;
    }
    const response = await fetch(baseUrl + "/models", {
      headers: accessHeaders,
      cache: "no-store",
      signal: AbortSignal.timeout(7000)
    });

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        error: "El servidor local respondió con el estado " + response.status
      }, { status: 502 });
    }

    const data = await response.json() as {
      data?: Array<{ id?: string }>;
    };
    const models = Array.isArray(data.data)
      ? data.data.map((item) => item.id).filter((id): id is string => typeof id === "string")
      : [];

    return NextResponse.json({
      ok: true,
      configuredModel,
      models,
      modelAvailable: models.includes(configuredModel)
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json({
      ok: false,
      error: timedOut
        ? "El servidor local no ha respondido en 7 segundos."
        : "No se ha podido conectar con el servidor local de IA."
    }, { status: timedOut ? 504 : 503 });
  }
}
