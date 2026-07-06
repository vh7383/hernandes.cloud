import type { ServiceStatus } from "@/lib/status";

const dotColor: Record<ServiceStatus["status"], string> = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  unknown: "bg-foreground/30",
};

const label: Record<ServiceStatus["status"], string> = {
  up: "En ligne",
  down: "Indisponible",
  unknown: "À venir",
};

export default function StatusBadge({ service }: { service: ServiceStatus }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
      <span className="text-sm font-medium">{service.publicLabel}</span>
      <span className="flex items-center gap-2 text-xs text-foreground/60">
        <span className={`h-2 w-2 rounded-full ${dotColor[service.status]}`} aria-hidden="true" />
        {label[service.status]}
      </span>
    </div>
  );
}
