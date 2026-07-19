import Image from "next/image";
import type { ServiceTarget } from "@/content/services";

export default function ServiceCard({ service }: { service: ServiceTarget }) {
  if (service.comingSoon) {
    if (service.screenshot) {
      return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-dashed border-border bg-surface opacity-70">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={service.screenshot}
              alt={`Écran de connexion de ${service.publicLabel}`}
              fill
              className="object-cover grayscale"
            />
            <span className="absolute right-2 top-2 rounded-full border border-border bg-background/80 px-2 py-0.5 text-xs text-foreground/70">
              bientôt
            </span>
          </div>
          <span className="px-4 py-3 text-center text-sm font-medium">
            {service.publicLabel}
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-6 text-center text-foreground/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-xs">
          bientôt
        </div>
        <span className="text-sm font-medium">{service.publicLabel}</span>
      </div>
    );
  }

  if (service.screenshot) {
    return (
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-brand"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={service.screenshot}
            alt={`Écran de connexion de ${service.publicLabel}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="px-4 py-3 text-center text-sm font-medium">
          {service.publicLabel}
        </span>
      </a>
    );
  }

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center transition-colors hover:border-brand"
    >
      {service.logo ? (
        <Image
          src={service.logo}
          alt={`Logo ${service.publicLabel}`}
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
      ) : (
        // Repli le temps d'avoir un vrai logo, cf. docs/decisions.md
        <span className="flex h-12 w-12 items-center justify-center text-2xl" aria-hidden="true">
          {service.icon ?? "🔗"}
        </span>
      )}
      <span className="text-sm font-medium">{service.publicLabel}</span>
    </a>
  );
}
