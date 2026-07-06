import type { Metadata } from "next";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "À propos — hernandes.cloud",
};

const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Systèmes", skills: ["Linux (Debian)", "Windows Server"] },
  { label: "Réseaux", skills: ["TCP/IP", "VPN WireGuard", "Routage", "Supervision"] },
  { label: "DevOps / Infra", skills: ["Docker", "Git", "GitLab CI/CD", "Bash", "Python"] },
  { label: "Outils", skills: ["Odoo", "ServiceNow", "WSUS", "ITCM"] },
  { label: "Développement", skills: ["Python", "JavaScript", "SQL"] },
];

const formation = [
  { label: "Ingénieur Informatique (en cours)", school: "CNAM", level: "Niveau 7 CEC" },
  { label: "Licence Informatique", school: "CNAM", level: "Niveau 6 CEC" },
  { label: "DUT Informatique", school: "Université Toulouse III", level: "Niveau 5 CEC" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">À propos de moi</h1>
      <p className="mt-4 text-foreground/70">
        Je m&apos;appelle Vincent Hernandes — Administrateur Systèmes &amp;
        Réseaux, ingénierie logicielle &amp; DevOps. Basé à Toulouse.
        N&apos;hésitez pas à me contacter pour échanger ou collaborer !
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Qui suis-je ?</h2>
        <p className="mt-3 text-foreground/70">
          Administrateur systèmes &amp; réseaux avec une forte composante
          ingénierie logicielle et DevOps. Expérience en environnement
          industriel (Thales), en conception d&apos;architectures techniques,
          en administration Linux/Docker/VPN, et en coordination
          opérationnelle de projets clients. Habitué aux environnements
          critiques, à la documentation, au suivi d&apos;avancement et à
          l&apos;automatisation.
        </p>
        <p className="mt-3 text-foreground/70">
          Curieux et touche-à-tout, je m&apos;intéresse particulièrement au
          self-hosting, à la cybersécurité et à l&apos;IA locale — ce site en
          est d&apos;ailleurs une démonstration directe. J&apos;aime
          comprendre un système en profondeur avant de le configurer, plutôt
          que de m&apos;en remettre à une automatisation opaque.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Expérience</h2>
        <ol className="mt-4 space-y-6 border-l border-border pl-6">
          {experience.map((entry) => (
            <li key={`${entry.company}-${entry.period}`} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                {entry.period}
              </p>
              <h3 className="mt-1 font-semibold">{entry.title}</h3>
              <p className="text-sm text-foreground/70">
                {entry.company}
                {entry.location ? ` — ${entry.location}` : ""}
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/60">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Formation</h2>
        <ul className="mt-3 space-y-2">
          {formation.map((f) => (
            <li key={f.label} className="text-sm text-foreground/70">
              <strong className="text-foreground">{f.label}</strong> — {f.school} ({f.level})
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Compétences clés</h2>
        <div className="mt-3 space-y-4">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="text-sm font-medium text-foreground/80">{group.label}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 text-sm text-foreground/70"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Langues</h2>
        <p className="mt-3 text-sm text-foreground/70">
          Français (natif) · Anglais (B2) · Espagnol (moyen)
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
