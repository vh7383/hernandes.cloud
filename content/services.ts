// Source unique pour les services auto-hébergés : réutilisée par la page
// /services (affichage) et par lib/status.ts (ping de disponibilité), pour ne
// jamais avoir deux listes d'URLs qui divergent.

export interface ServiceTarget {
  name: string;
  url: string;
  publicLabel: string;
  logo?: string;
  /** Si défini, ce service tourne sur une machine qu'il faut réveiller (WoL) avant de le ping. */
  wakeTarget?: "desktop" | "kali";
  /** Services pas encore exposés publiquement (ex: photos, vidéosurveillance à venir). */
  comingSoon?: boolean;
}

export const services: ServiceTarget[] = [
  {
    name: "nextcloud",
    url: "https://drive.hernandes.cloud",
    publicLabel: "Nextcloud",
    logo: "/images/nextcloud_logo_resized.png",
  },
  {
    name: "vaultwarden",
    url: "https://vaultwarden.hernandes.cloud",
    publicLabel: "Vaultwarden",
    logo: "/images/vaultwarden_logo_resized.png",
  },
  {
    name: "plex",
    url: "https://plex.tv",
    publicLabel: "Plex",
    logo: "/images/plex_logo_resized.jpeg",
  },
  {
    name: "grafana",
    url: "https://stats.hernandes.cloud",
    publicLabel: "Grafana",
    logo: "/images/grafana_logo_resized.png",
  },
  {
    name: "photos",
    url: "",
    publicLabel: "Photos",
    comingSoon: true,
  },
  {
    name: "surveillance",
    url: "",
    publicLabel: "Vidéosurveillance",
    comingSoon: true,
  },
];
