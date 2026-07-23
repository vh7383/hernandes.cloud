import { services, type ServiceTarget } from "@/content/services";

export interface ServiceStatus {
  name: string;
  publicLabel: string;
  status: "up" | "down" | "unknown";
}

async function fetchWithTimeout(url: string, method: "HEAD" | "GET", timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { method, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Un sous-domaine hernandes.cloud pas encore configuré côté cible réelle
 * (alias DSM manquant, DNS absent, etc.) peut atterrir sur notre propre site
 * via le `default_server` nginx (cf. docs/decisions.md) au lieu d'échouer -
 * faux "en ligne" sinon. On détecte ça via un header propre à CE déploiement
 * (`X-Site-Id`, cf. next.config.ts) - pas `x-powered-by: Next.js` seul, qui
 * donne un faux négatif sur des services externes qui tournent eux-mêmes sur
 * Next.js (constaté en réel : plex.tv envoie ce header aussi).
 */
function looksLikeOurOwnSite(res: Response): boolean {
  return res.headers.get("x-site-id") === "hernandes-cloud-self";
}

async function checkService(service: ServiceTarget): Promise<ServiceStatus> {
  if (service.comingSoon || !service.url) {
    return { name: service.name, publicLabel: service.publicLabel, status: "unknown" };
  }

  try {
    // HEAD d'abord ; certains services mal configurés y répondent mal, d'où le fallback GET.
    const res = await fetchWithTimeout(service.url, "HEAD");
    const up = res.status < 500 && !looksLikeOurOwnSite(res);
    return { name: service.name, publicLabel: service.publicLabel, status: up ? "up" : "down" };
  } catch {
    try {
      const res = await fetchWithTimeout(service.url, "GET");
      const up = res.status < 500 && !looksLikeOurOwnSite(res);
      return { name: service.name, publicLabel: service.publicLabel, status: up ? "up" : "down" };
    } catch {
      return { name: service.name, publicLabel: service.publicLabel, status: "down" };
    }
  }
}

export async function getAllServiceStatuses(): Promise<ServiceStatus[]> {
  return Promise.all(services.map(checkService));
}

/**
 * Le tableau de bord public est un dashboard Grafana hébergé sur le Pi
 * (toujours allumé) - plus l'ancien plan Kali/Elastic (jamais concrétisé,
 * cf. docs/decisions.md). On vérifie juste que le lien public répond.
 */
export async function getMonitoringStatus(): Promise<"up" | "down"> {
  const embedUrl = process.env.NEXT_PUBLIC_MONITORING_EMBED_URL;
  if (!embedUrl) return "down";

  try {
    const res = await fetchWithTimeout(embedUrl, "HEAD");
    return res.status < 500 ? "up" : "down";
  } catch {
    return "down";
  }
}
