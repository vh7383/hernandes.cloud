import { NextResponse } from "next/server";
import { consumeToken, getClientIp } from "@/lib/rateLimit";
import { askGabrielle } from "@/lib/gabrielle";

const MAX_MESSAGE_LENGTH = 2000;

function sanitizeInput(input: unknown): { message: string; session: string } | null {
  if (typeof input !== "object" || input === null) return null;
  const { message, session } = input as Record<string, unknown>;

  if (typeof message !== "string" || message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return null;
  }
  if (typeof session !== "string" || session.length === 0) return null;

  return { message, session };
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
  const input = sanitizeInput(body);
  if (!input) {
    return NextResponse.json({ error: "Message invalide." }, { status: 400 });
  }

  try {
    const answer = await askGabrielle(input.message, input.session);
    // verdict est de l'observabilite, jamais renvoye au navigateur.
    console.debug(`[gabrielle] statut=${answer.statut} verdict=${answer.verdict}`);
    return NextResponse.json({
      reponse: answer.reponse,
      statut: answer.statut,
      sources: answer.sources,
    });
  } catch (error) {
    console.error("Erreur Gabrielle:", error);
    return NextResponse.json(
      { error: "Gabrielle n'a pas pu répondre, réessaie." },
      { status: 502 },
    );
  }
}
