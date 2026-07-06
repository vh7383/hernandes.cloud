import { NextResponse } from "next/server";
import { wakeTargets } from "@/lib/wakeTargets";
import { isReachable } from "@/lib/reachability";
import { sendMagicPacket } from "@/lib/wol";
import { recordActivity } from "@/lib/activityTracker";
import { consumeToken, getClientIp } from "@/lib/rateLimit";
import { askAliciaLite, type ChatMessage } from "@/lib/aliciaLite";
import { ALICIA_LITE_SYSTEM_PROMPT } from "@/lib/chatPrompt";

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
  // Le réveil (si nécessaire) compte aussi comme une tentative d'usage : on
  // rate-limite donc /api/chat globalement, pas seulement l'appel LLM.
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

  const desktop = wakeTargets.desktop;
  const up = await isReachable(desktop.ip, desktop.checkPort);

  if (!up) {
    if (desktop.mac) await sendMagicPacket(desktop.mac);
    recordActivity("desktop");
    // 503 volontaire : le client (ChatWidget) interprète ce statut comme
    // "réveil en cours" et réessaie la même requête toutes les ~3s.
    return NextResponse.json({ status: "waking" }, { status: 503 });
  }

  recordActivity("desktop");

  try {
    const reply = await askAliciaLite(messages, ALICIA_LITE_SYSTEM_PROMPT);
    return NextResponse.json({ status: "ok", reply });
  } catch (error) {
    console.error("Erreur AlicIA-lite:", error);
    return NextResponse.json(
      { error: "AlicIA-lite n'a pas pu répondre, réessaie." },
      { status: 502 },
    );
  }
}
