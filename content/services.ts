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
  /** Vraie capture de l'écran de connexion du service, prioritaire sur logo/icon (cf. ServiceCard). */
  screenshot?: string;
  /** Regroupement visuel sur /services (cf. app/services/page.tsx). */
  group: "pi" | "nas";
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

  // --- NAS Synology (DS218play) --- reverse-proxifié depuis le 2026-07-21 :
  // le NAS n'expose plus ses ports DSM (5443, 9901, ...) directement, le
  // certificat TLS est désormais le même que celui partagé par le Pi
  // (cf. docs/decisions.md). Chaque service répond sur son sous-domaine nu,
  // sans port, comme n'importe quel autre service de ce site.
  {
    name: "photos",
    url: "https://photo.hernandes.cloud",
    publicLabel: "Photos",
    logo: "/images/synology/photos.svg",
    screenshot: "/images/synology/photos-screenshot.jpg",
    group: "nas",
  },
  {
    name: "surveillance",
    url: "https://cam.hernandes.cloud",
    publicLabel: "Vidéosurveillance",
    logo: "/images/synology/surveillance.svg",
    screenshot: "/images/synology/surveillance-screenshot.jpg",
    group: "nas",
  },
  {
    name: "synology-drive",
    url: "https://syno-drive.hernandes.cloud",
    publicLabel: "Synology Drive",
    logo: "/images/synology/synology-drive.svg",
    screenshot: "/images/synology/synology-drive-screenshot.jpg",
    group: "nas",
  },
  {
    name: "file-station",
    url: "https://file.hernandes.cloud",
    publicLabel: "File Station",
    logo: "/images/synology/file-station.svg",
    screenshot: "/images/synology/file-station-screenshot.jpg",
    group: "nas",
  },
  {
    name: "note-station",
    url: "https://note.hernandes.cloud",
    publicLabel: "Note Station",
    logo: "/images/synology/note-station.svg",
    screenshot: "/images/synology/note-station-screenshot.jpg",
    group: "nas",
  },
  {
    name: "audio-station",
    url: "https://audio.hernandes.cloud",
    publicLabel: "Audio Station",
    logo: "/images/synology/audio-station.svg",
    screenshot: "/images/synology/audio-station-screenshot.jpg",
    group: "nas",
  },
  {
    name: "contacts",
    url: "https://contacts.hernandes.cloud",
    publicLabel: "Contacts",
    logo: "/images/synology/contacts.svg",
    screenshot: "/images/synology/contacts-screenshot.jpg",
    group: "nas",
  },
  {
    name: "dsm",
    url: "https://nas.hernandes.cloud",
    publicLabel: "DSM",
    logo: "/images/synology/dsm.svg",
    screenshot: "/images/synology/dsm-screenshot.jpg",
    group: "nas",
    comingSoon: true,
  },
];
