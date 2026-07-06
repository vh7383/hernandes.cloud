import type { Metadata } from "next";
import { services } from "@/content/services";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Services — hernandes.cloud",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Mes services hébergés
      </h1>
      <p className="mt-3 text-foreground/70">
        Applications que j&apos;auto-héberge sur mon infrastructure perso.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
