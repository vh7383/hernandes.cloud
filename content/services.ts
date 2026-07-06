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
    url: "http://hernandes.cloud:32400/web",
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

  // --- NAS Synology (DS218play) --- alias + ports HTTPS configurés dans le
  // portail d'applications DSM (Panneau de configuration > Portail de
  // connexion > Applications), confirmés joignables depuis l'extérieur le
  // 2026-07-06. Le certificat TLS présenté est encore celui par défaut du NAS
  // (pas le certificat partagé avec le Pi) — cf. docs/decisions.md — donc ces
  // services peuvent apparaître "indisponible" côté /monitoring tant que ce
  // n'est pas resynchronisé, même si les URLs répondent réellement.
  {
    name: "photos",
    url: "https://photo.hernandes.cloud:5443",
    publicLabel: "Photos",
    logo: "/images/synology/photos.svg",
    group: "nas",
  },
  {
    name: "surveillance",
    url: "https://cam.hernandes.cloud:9901",
    publicLabel: "Vidéosurveillance",
    logo: "/images/synology/surveillance.svg",
    group: "nas",
  },
  {
    name: "synology-drive",
    url: "https://syno-drive.hernandes.cloud:10003",
    publicLabel: "Synology Drive",
    logo: "/images/synology/synology-drive.svg",
    group: "nas",
  },
  {
    name: "file-station",
    url: "https://file.hernandes.cloud:7001",
    publicLabel: "File Station",
    logo: "/images/synology/file-station.svg",
    group: "nas",
  },
  {
    name: "note-station",
    url: "https://note.hernandes.cloud:9351",
    publicLabel: "Note Station",
    logo: "/images/synology/note-station.svg",
    group: "nas",
  },
  {
    name: "audio-station",
    url: "https://audio.hernandes.cloud:8801",
    publicLabel: "Audio Station",
    logo: "/images/synology/audio-station.svg",
    group: "nas",
  },
  {
    name: "contacts",
    url: "https://contacts.hernandes.cloud:25556",
    publicLabel: "Contacts",
    logo: "/images/synology/contacts.svg",
    group: "nas",
  },
  {
    name: "dsm",
    url: "https://nas.hernandes.cloud",
    publicLabel: "DSM",
    logo: "/images/synology/dsm.svg",
    group: "nas",
    comingSoon: true,
  },
];
