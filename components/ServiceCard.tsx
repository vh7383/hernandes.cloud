import Image from "next/image";
import type { ServiceTarget } from "@/content/services";

export default function ServiceCard({ service }: { service: ServiceTarget }) {
  if (service.comingSoon) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-6 text-center text-foreground/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-xs">
          bientôt
        </div>
        <span className="text-sm font-medium">{service.publicLabel}</span>
      </div>
    );
  }

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center transition-colors hover:border-brand"
    >
      {service.logo && (
        <Image
          src={service.logo}
          alt={`Logo ${service.publicLabel}`}
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
      )}
      <span className="text-sm font-medium">{service.publicLabel}</span>
    </a>
  );
}
