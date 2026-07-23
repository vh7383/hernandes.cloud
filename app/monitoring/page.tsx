import type { Metadata } from "next";
import { getAllServiceStatuses, getMonitoringStatus } from "@/lib/status";
import StatusBadge from "@/components/StatusBadge";
import MonitoringEmbed from "@/components/MonitoringEmbed";

export const metadata: Metadata = {
  title: "Monitoring - hernandes.cloud",
};

// Revalidation courte plutôt que 100% statique ou 100% dynamique : les
// badges restent à jour sans re-vérifier tous les services à chaque visite.
export const revalidate = 60;

export default async function MonitoringPage() {
  const [services, monitoringStatus] = await Promise.all([
    getAllServiceStatuses(),
    getMonitoringStatus(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
      <p className="mt-3 text-foreground/70">
        État en direct de mes services, et tableau de bord de mon
        infrastructure (Grafana/Loki/Prometheus).
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <StatusBadge key={service.name} service={service} />
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">Tableau de bord</h2>
      <div className="mt-4">
        <MonitoringEmbed available={monitoringStatus === "up"} />
      </div>
    </div>
  );
}
