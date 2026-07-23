// Backend de Gabrielle : sa propre API (plus un appel direct a llama.cpp),
// qui gere elle-meme l'historique de conversation par session et consulte
// Raphael (base de connaissance perso) pour les reponses sourcees. Ce client
// reste un simple relais cote serveur, jamais appele depuis le navigateur.
const GABRIELLE_API_URL = process.env.GABRIELLE_API_URL ?? "http://127.0.0.1:8082";

export type GabrielleStatut = "sources" | "conversation" | "indisponible" | "aucune_source";

export interface GabrielleSource {
  provenance: string;
  score: number;
  contenu: string;
}

export interface GabrielleAnswer {
  reponse: string;
  statut: GabrielleStatut;
  verdict: string;
  sources: GabrielleSource[];
  ts: string;
}

/**
 * Appelle POST /api/v1/ask. Toujours 200 sauf requete malformee (400) — un
 * Raphael injoignable cote Gabrielle se traduit par statut: "indisponible"
 * dans une reponse 200, pas par une erreur HTTP.
 */
export async function askGabrielle(message: string, session: string): Promise<GabrielleAnswer> {
  const response = await fetch(`${GABRIELLE_API_URL}/api/v1/ask`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, session }),
  });

  if (!response.ok) {
    throw new Error(`Gabrielle a repondu avec le statut ${response.status}`);
  }

  return response.json();
}
