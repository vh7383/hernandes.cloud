import type { WakeTargetName } from "@/lib/wakeTargets";

// En mémoire, à l'échelle du process Next.js — suffisant car le déploiement
// cible est un unique conteneur Docker (pas de multi-instance), voir
// docs/decisions.md. Ne sert plus qu'à Kali (lib/status.ts,
// lib/kaliSleepScheduler.ts) depuis le retrait du réveil Desktop.
const lastActivityByTarget = new Map<WakeTargetName, number>();

export function recordActivity(target: WakeTargetName): void {
  lastActivityByTarget.set(target, Date.now());
}

export function getLastActivity(target: WakeTargetName): number | null {
  return lastActivityByTarget.get(target) ?? null;
}
