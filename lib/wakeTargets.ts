// Source unique pour les machines "réveillables" du LAN. Ne reste plus que
// Kali depuis que le chat (seul appelant du réveil Desktop) cible désormais
// llama.cpp sur le Pi — cf. docs/decisions.md (2026-07-10).

export type WakeTargetName = "kali";

export interface WakeTargetConfig {
  ip: string;
  checkPort: number;
  /**
   * Toujours false : le réveil Wi-Fi de Kali a été testé et abandonné, la
   * Freebox ne relayant pas fiablement les magic packets vers un client Wi-Fi
   * endormi (cf. docs/decisions.md, 2026-07-06). Conservé pour savoir
   * où/comment vérifier sa disponibilité (lib/status.ts), sans réveil auto.
   */
  wakeable: boolean;
}

export const wakeTargets: Record<WakeTargetName, WakeTargetConfig> = {
  kali: {
    ip: "192.168.1.197",
    checkPort: Number(process.env.KALI_SERVICE_PORT ?? 5601),
    wakeable: false,
  },
};
