// Source unique pour les services auto-hébergés : réutilisée par la page
// /services (affichage) et par lib/status.ts (ping de disponibilité), pour ne
// jamais avoir deux listes d'URLs qui divergent.

export interface ServiceTarget {
  name: string;
  url: string;
  publicLabel: string;
  logo?: string;
  /** Repli si pas de fichier logo : emoji/glyphe simple, cf. docs/decisions.md. */
  icon?: string;
  /** Regroupement visuel sur /services (cf. app/services/page.tsx). */
  group: "pi" | "nas";
  /** Si défini, ce service tourne sur une machine qu'il faut réveiller (WoL) avant de le ping. */
  wakeTarget?: "desktop" | "kali";
  /** Services pas encore exposés publiquement. */
  comingSoon?: boolean;
}

export const services: ServiceTarget[] = [
  // --- Hébergés sur le Pi ---
  {
    name: "nextcloud",
    url: "https://drive.hernandes.cloud",
    publicLabel: "Nextcloud",
    logo: "/images/nextcloud_logo_resized.png",
    group: "pi",
  },
  {
    name: "vaultwarden",
    url: "https://vaultwarden.hernandes.cloud",
    publicLabel: "Vaultwarden",
    logo: "/images/vaultwarden_logo_resized.png",
    group: "pi",
  },
  {
    name: "plex",
    url: "https://plex.tv",
    publicLabel: "Plex",
    logo: "/images/plex_logo_resized.jpeg",
    group: "pi",
  },
  {
    name: "grafana",
    url: "https://stats.hernandes.cloud",
    publicLabel: "Grafana",
    logo: "/images/grafana_logo_resized.png",
    group: "pi",
  },

  // --- NAS Synology (DS218play) --- URLs par alias du portail d'applications
  // DSM. Seuls `cam` et `photo` avaient déjà un alias configuré au moment de
  // l'écriture ; les autres sous-domaines doivent être ajoutés côté DSM
  // (Panneau de configuration > Portail de connexion > Applications) pour
  // que ces liens fonctionnent réellement.
  {
    name: "photos",
    url: "https://photo.hernandes.cloud",
    publicLabel: "Photos",
    icon: "🖼️",
    group: "nas",
  },
  {
    name: "surveillance",
    url: "https://cam.hernandes.cloud",
    publicLabel: "Vidéosurveillance",
    icon: "🎥",
    group: "nas",
  },
  {
    name: "synology-drive",
    url: "https://syno-drive.hernandes.cloud",
    publicLabel: "Synology Drive",
    icon: "💾",
    group: "nas",
  },
  {
    name: "file-station",
    url: "https://files.hernandes.cloud",
    publicLabel: "File Station",
    icon: "📁",
    group: "nas",
  },
  {
    name: "note-station",
    url: "https://notes.hernandes.cloud",
    publicLabel: "Note Station",
    icon: "📝",
    group: "nas",
  },
  {
    name: "audio-station",
    url: "https://audio.hernandes.cloud",
    publicLabel: "Audio Station",
    icon: "🎵",
    group: "nas",
  },
  {
    name: "contacts",
    url: "https://contacts.hernandes.cloud",
    publicLabel: "Contacts",
    icon: "👤",
    group: "nas",
  },
  {
    name: "dsm",
    url: "https://nas.hernandes.cloud",
    publicLabel: "DSM",
    icon: "⚙️",
    group: "nas",
  },
];
