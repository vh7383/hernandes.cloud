import { NextResponse } from "next/server";
import { consumeToken, getClientIp } from "@/lib/rateLimit";
import { askGabrielle, type ChatMessage } from "@/lib/llamaCpp";
import { GABRIELLE_SYSTEM_PROMPT } from "@/lib/chatPrompt";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const messages = input.slice(-MAX_MESSAGES);
  for (const m of messages) {
    if (
      typeof m !== "object" ||
      m === null ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_MESSAGE_LENGTH
    ) {
      return null;
    }
  }
  return messages as ChatMessage[];
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!consumeToken(`chat:${ip}`)) {
    return NextResponse.json(
      { error: "Trop de requêtes, réessaie dans un instant." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const messages = sanitizeMessages(body?.messages);
  if (!messages) {
    return NextResponse.json({ error: "Message invalide." }, { status: 400 });
  }

  try {
    const reply = await askGabrielle(messages, GABRIELLE_SYSTEM_PROMPT);
    return NextResponse.json({ status: "ok", reply });
  } catch (error) {
    console.error("Erreur Gabrielle:", error);
    return NextResponse.json(
      { error: "Gabrielle n'a pas pu répondre, réessaie." },
      { status: 502 },
    );
  }
}
