import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — hernandes.cloud",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">À propos de moi</h1>
      <p className="mt-4 text-foreground/70">
        Je m&apos;appelle Vincent Hernandes. Bienvenue sur mon espace — et
        n&apos;hésitez pas à me contacter pour échanger ou collaborer !
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Qui suis-je ?</h2>
        <p className="mt-3 text-foreground/70">
          Je propose mes compétences pour concevoir, déployer et maintenir des
          solutions informatiques. Du développement d&apos;applications web à
          la configuration de serveurs, en passant par l&apos;intégration de
          nouveaux outils, mon objectif est de renforcer l&apos;efficacité
          tout en faisant gagner du temps.
        </p>
        <p className="mt-3 text-foreground/70">
          Mon approche : allier rigueur technique et créativité pour trouver
          des solutions sur mesure, avec une communication claire et
          transparente.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Compétences clés</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {["Développement", "Administration système", "Gestion de projet", "Self-hosting", "Cybersécurité"].map(
            (skill) => (
              <li
                key={skill}
                className="rounded-full border border-border px-3 py-1 text-sm text-foreground/70"
              >
                {skill}
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="mt-3 text-foreground/70">
          Envie d&apos;en savoir plus, de me proposer une collaboration ou
          simplement de discuter projets informatiques ?
        </p>
        <a
          href="mailto:vincent.hernandes@protonmail.com"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Me contacter
        </a>
      </section>
    </div>
  );
}
