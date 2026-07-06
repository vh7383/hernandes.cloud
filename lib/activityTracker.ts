import type { WakeTargetName } from "@/lib/wakeTargets";

// En mémoire, à l'échelle du process Next.js — suffisant car le déploiement
// cible est un unique conteneur Docker (pas de multi-instance), voir
// docs/decisions.md. Consommé par /api/activity, lui-même interrogé par le
// script de veille local du Desktop (jamais l'inverse — cf. architecture.md).
const lastActivityByTarget = new Map<WakeTargetName, number>();

export function recordActivity(target: WakeTargetName): void {
  lastActivityByTarget.set(target, Date.now());
}

export function getLastActivity(target: WakeTargetName): number | null {
  return lastActivityByTarget.get(target) ?? null;
}
