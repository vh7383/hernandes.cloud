export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Placeholders : l'instance Ollama isolée dédiée à AlicIA-lite (distincte de
// la vraie AlicIA/OpenClaw) n'est pas encore montée sur le Desktop au moment
// où ce fichier est écrit — cf. docs/decisions.md. À confirmer/ajuster une
// fois ce service réellement en place ; en attendant, tout est configurable
// par variable d'env pour ne rien re-coder à ce moment-là.
const OLLAMA_URL = process.env.ALICIA_LITE_OLLAMA_URL ?? "http://192.168.1.147:11434";
const MODEL = process.env.ALICIA_LITE_MODEL ?? "qwen2.5:7b-instruct-q4_K_M";

/** Appelle l'API "chat" d'Ollama (POST /api/chat, format {model, messages, stream}). */
export async function askAliciaLite(
  messages: ChatMessage[],
  systemPrompt: string,
): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`AlicIA-lite a répondu avec le statut ${response.status}`);
  }

  const data = await response.json();
  return data.message?.content ?? "";
}
