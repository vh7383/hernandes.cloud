// Limiteur "token bucket" en mémoire, par clé (généralement `${route}:${ip}`).
// Volontairement simple : pas de Redis, le déploiement cible est un unique
// conteneur (cf. docs/decisions.md), donc un Map en mémoire suffit.

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

const CAPACITY = 5;
const REFILL_INTERVAL_MS = 60_000; // +1 jeton par minute

/** Retourne true si la requête est autorisée, false si la limite est atteinte. */
export function consumeToken(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, lastRefill: now };

  const elapsed = now - bucket.lastRefill;
  const refillCount = Math.floor(elapsed / REFILL_INTERVAL_MS);
  if (refillCount > 0) {
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + refillCount);
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

/** IP cliente en tenant compte du reverse proxy nginx devant l'app. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
