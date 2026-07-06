import { services, type ServiceTarget } from "@/content/services";
import { wakeTargets } from "@/lib/wakeTargets";
import { isReachable } from "@/lib/reachability";

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

async function checkService(service: ServiceTarget): Promise<ServiceStatus> {
  if (service.comingSoon || !service.url) {
    return { name: service.name, publicLabel: service.publicLabel, status: "unknown" };
  }

  try {
    // HEAD d'abord ; certains services mal configurés y répondent mal, d'où le fallback GET.
    const res = await fetchWithTimeout(service.url, "HEAD");
    return { name: service.name, publicLabel: service.publicLabel, status: res.status < 500 ? "up" : "down" };
  } catch {
    try {
      const res = await fetchWithTimeout(service.url, "GET");
      return { name: service.name, publicLabel: service.publicLabel, status: res.status < 500 ? "up" : "down" };
    } catch {
      return { name: service.name, publicLabel: service.publicLabel, status: "down" };
    }
  }
}

export async function getAllServiceStatuses(): Promise<ServiceStatus[]> {
  return Promise.all(services.map(checkService));
}

/**
 * Kali/Elastic n'est pas dans content/services.ts (ce n'est pas un lien de
 * la page /services) et n'est pas réveillée automatiquement — cf.
 * docs/decisions.md. On vérifie juste un port TCP, sans tenter de réveil.
 */
export async function getMonitoringStatus(): Promise<"up" | "down"> {
  const kali = wakeTargets.kali;
  const reachable = await isReachable(kali.ip, kali.checkPort, 3000);
  return reachable ? "up" : "down";
}
