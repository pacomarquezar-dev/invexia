import { NextRequest, NextResponse } from "next/server";
import { callAnthropicChatModel } from "@/lib/anthropicClient";
import { handleChatRequest } from "@/lib/chatHandler";

export const runtime = "nodejs";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "El cuerpo de la petición no es JSON válido." },
      { status: 400 },
    );
  }

  const result = await handleChatRequest(getClientIp(request), rawBody, {
    callModel: callAnthropicChatModel,
  });

  return NextResponse.json(result.body, { status: result.status });
}
