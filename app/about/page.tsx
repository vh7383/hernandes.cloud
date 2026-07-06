import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — hernandes.cloud",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">À propos de moi</h1>
      <p className="mt-4 text-foreground/70">
        Je m&apos;appelle Vincent Hernandes, basé à Toulouse. Bienvenue sur mon
        espace — et n&apos;hésitez pas à me contacter pour échanger ou
        collaborer !
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Qui suis-je ?</h2>
        <p className="mt-3 text-foreground/70">
          Professionnel de l&apos;informatique avec un double ancrage
          ingénierie logicielle et infrastructure, je propose mes compétences
          pour concevoir, déployer et maintenir des solutions informatiques.
          Du développement d&apos;applications web à l&apos;administration de
          serveurs, en passant par l&apos;intégration de nouveaux outils, mon
          objectif est de renforcer l&apos;efficacité tout en faisant gagner
          du temps.
        </p>
        <p className="mt-3 text-foreground/70">
          Curieux et touche-à-tout, je m&apos;intéresse particulièrement au
          self-hosting, à la cybersécurité et à l&apos;IA locale — ce site en
          est d&apos;ailleurs une démonstration directe. Mon approche : allier
          rigueur technique et curiosité pour trouver des solutions sur
          mesure, avec une communication claire et transparente. J&apos;aime
          comprendre un système en profondeur avant de le configurer, plutôt
          que de m&apos;en remettre à une automatisation opaque.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Parcours</h2>
        <p className="mt-3 text-foreground/70">
          Actuellement chez <strong>Qualitanie</strong>{" "}
          (Saverdun), je poursuis en parallèle une formation
          d&apos;ingénieur au{" "}
          <strong>Conservatoire National des Arts et Métiers</strong> (CNAM,
          2024–2026), parcours Architecture et Ingénierie des Systèmes et
          Logiciels. Je complète régulièrement ce socle par des certifications
          ciblées : ITIL 4 Foundation, JIRA Cloud (configuration, reporting,
          gestion de projet), et les fondamentaux du développement web
          (HTML5/CSS3).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">En dehors du code</h2>
        <p className="mt-3 text-foreground/70">
          Depuis 2021, je suis moniteur bénévole à l&apos;école de voile des{" "}
          <strong>Glénans</strong>, et depuis 2025 chauffeur-logisticien
          bénévole aux <strong>Restos du Cœur</strong>. Côté loisirs : la
          musique, la cuisine, la littérature, et les voyages — Vietnam, Asie,
          montagne.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Compétences clés</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[
            "Développement",
            "Administration système",
            "Gestion de projet",
            "Self-hosting",
            "Cybersécurité",
            "ITIL 4",
            "JIRA",
          ].map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border px-3 py-1 text-sm text-foreground/70"
            >
              {skill}
            </li>
          ))}
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
