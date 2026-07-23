import type { Metadata } from "next";
import { services } from "@/content/services";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Services - hernandes.cloud",
};

export default function ServicesPage() {
  const piServices = services.filter((s) => s.group === "pi");
  const nasServices = services.filter((s) => s.group === "nas");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Mes services hébergés
      </h1>
      <p className="mt-3 text-foreground/70">
        Applications que j&apos;auto-héberge sur mon infrastructure perso.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Raspberry Pi</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {piServices.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">NAS Synology</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {nasServices.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
