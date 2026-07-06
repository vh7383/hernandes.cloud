import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <Link
            href="/projects"
            className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-brand"
          >
            <h2 className="font-semibold">Projets</h2>
            <p className="mt-2 text-sm text-foreground/70">
              Un aperçu de ce que je construis, ce site y compris.
            </p>
          </Link>
          <Link
            href="/services"
            className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-brand"
          >
            <h2 className="font-semibold">Services</h2>
            <p className="mt-2 text-sm text-foreground/70">
              Les applications que j&apos;auto-héberge : Nextcloud, Vaultwarden, Plex...
            </p>
          </Link>
          <Link
            href="/monitoring"
            className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-brand"
          >
            <h2 className="font-semibold">Monitoring</h2>
            <p className="mt-2 text-sm text-foreground/70">
              L&apos;état en direct de mon infrastructure.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
