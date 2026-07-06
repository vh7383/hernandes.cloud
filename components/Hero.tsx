import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Bienvenue !
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
        Je partage ici mes projets, mes compétences et l&apos;accès à mon
        système auto-hébergé.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/projects"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Voir mes projets
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
        >
          Me contacter
        </Link>
      </div>
    </section>
  );
}
