export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Backend de Gabrielle : un serveur llama.cpp (llama-server, API compatible
// OpenAI) tournant directement sur le Raspberry Pi — pas de réveil LAN
// nécessaire, cette machine est déjà allumée 24/7. Petit modèle local
// (0.5B) volontairement modeste ; la recherche documentaire (RAG) est gérée
// côté serveur, en amont de cet appel — ce client reste un simple proxy,
// cf. docs/decisions.md.
const LLAMACPP_URL = process.env.GABRIELLE_LLAMACPP_URL ?? "http://127.0.0.1:8080";
const MODEL = process.env.GABRIELLE_MODEL ?? "qwen2.5-0.5b-instruct";

/** Appelle l'endpoint compatible OpenAI de llama.cpp (POST /v1/chat/completions). */
export async function askGabrielle(
  messages: ChatMessage[],
  systemPrompt: string,
): Promise<string> {
  const response = await fetch(`${LLAMACPP_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gabrielle (llama.cpp) a répondu avec le statut ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
