// Source unique pour les machines "réveillables" du LAN. Les ports de service
// sont volontairement configurables par variable d'env : les vrais services
// (AlicIA-lite sur Desktop, Kibana sur Kali) n'existent pas encore au moment
// où ce fichier est écrit, donc on ne fige pas un port en dur.

export type WakeTargetName = "desktop" | "kali";

export interface WakeTargetConfig {
  /** Adresse MAC pour le magic packet. Absente si la cible n'est pas réveillable. */
  mac?: string;
  ip: string;
  checkPort: number;
  /**
   * Si false, on ne tente jamais de réveil automatique — cf. docs/decisions.md
   * (2026-07-06) : le réveil Wi-Fi de Kali a été testé et abandonné, la
   * Freebox ne relayant pas fiablement les magic packets vers un client Wi-Fi
   * endormi. Kali reste dans cette liste car on a quand même besoin de savoir
   * où/comment vérifier sa disponibilité (lib/status.ts), juste sans réveil.
   */
  wakeable: boolean;
}

export const wakeTargets: Record<WakeTargetName, WakeTargetConfig> = {
  desktop: {
    mac: "E8:9C:25:6D:9A:DF",
    ip: "192.168.1.147",
    checkPort: Number(process.env.DESKTOP_SERVICE_PORT ?? 11434),
    wakeable: true,
  },
  kali: {
    ip: "192.168.1.197",
    checkPort: Number(process.env.KALI_SERVICE_PORT ?? 5601),
    wakeable: false,
  },
};
