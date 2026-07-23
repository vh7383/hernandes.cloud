import type { Metadata } from "next";
import Image from "next/image";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "À propos - hernandes.cloud",
};

const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Systèmes", skills: ["Linux (Debian)", "Arch Linux", "Windows Server", "WSL2", "Virtualisation / conteneurs", "IBM AS/400"] },
  { label: "Réseaux", skills: ["TCP/IP", "Routage", "VPN WireGuard", "Reverse proxy (Nginx)", "Split-DNS", "HTTPS/HSTS"] },
  { label: "DevOps", skills: ["Docker", "Ansible", "Git", "GitLab CI/CD", "Bash", "Python"] },
  { label: "Supervision & observabilité", skills: ["PLG (Prometheus/Loki/Grafana)", "ELK (Elasticsearch/Logstash/Kibana)", "ServiceNow (ITSM)"] },
  { label: "IA / LLM", skills: ["Inférence locale (Ollama)", "Agents & tool use", "RAG", "MCP", "Prompt engineering"] },
  { label: "Développement", skills: ["Python", "Java", "C", "Ada", "JavaScript / Angular", "JavaScript / React", "SQL (MariaDB)"] },
  { label: "Outils", skills: ["Odoo", "ServiceNow", "WSUS", "ITCM", "ITIL Foundation"] },
];

const formation = [
  { label: "Ingénieur Informatique (en cours)", school: "CNAM", level: "Niveau 7 CEC" },
  { label: "Licence Informatique", school: "CNAM", level: "Niveau 6 CEC" },
  { label: "DUT Informatique", school: "Université Toulouse III", level: "Niveau 5 CEC" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-5">
        <Image
          src="/images/vincent-avatar.jpg"
          alt="Photo de Vincent Hernandes"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">À propos de moi</h1>
        </div>
      </div>
      <p className="mt-4 text-foreground/70">
        Je m&apos;appelle Vincent Hernandes - spécialisé en architecture et
        ingénierie des systèmes et logiciels. Basé à Toulouse, ouvert à la
        mobilité internationale.
        N&apos;hésitez pas à me contacter pour échanger ou collaborer !
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Qui suis-je ?</h2>
        <p className="mt-3 text-foreground/70">
          Ingénieur en architecture et ingénierie des systèmes et logiciels,
          en fin de cursus CNAM (niveau 7 CEC), venu
          du terrain : 7 ans de progression du support N1 à la conception
          d&apos;architectures et à la référence technique projets. Double
          culture systèmes/réseaux et ingénierie logicielle, forgée en
          environnement industriel critique (Thales) et en PME multi-clients.
          Pratique quotidienne de l&apos;automatisation, de la documentation
          et du self-hosting - dont un lab personnel d&apos;agents IA locaux,
          ce site en étant la démonstration directe.
        </p>
        <p className="mt-3 text-foreground/70">
          Curieux et touche-à-tout, je m&apos;intéresse particulièrement au
          self-hosting, à la cybersécurité et à l&apos;IA locale. J&apos;aime
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
                {entry.location ? ` - ${entry.location}` : ""}
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
              <strong className="text-foreground">{f.label}</strong> - {f.school} ({f.level})
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
        <div className="mt-3 space-y-4">
          <div className="flex items-start gap-3">
            <Image
              src="/images/logos/glenans.svg"
              alt="Logo Les Glénans"
              width={40}
              height={21}
              className="mt-1 h-6 w-auto shrink-0"
            />
            <p className="text-foreground/70">
              <a
                href="https://www.glenans.asso.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-brand"
              >
                Les Glénans ↗
              </a>{" "}
              - moniteur bénévole à l&apos;école de voile depuis 2021, et
              membre du comité de secteur : j&apos;aide à faire vivre la base
              et la communauté au quotidien.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Image
              src="/images/logos/restos-du-coeur.svg"
              alt="Logo Les Restos du Cœur"
              width={32}
              height={32}
              className="mt-1 h-8 w-auto shrink-0"
            />
            <p className="text-foreground/70">
              <a
                href="https://www.restosducoeur.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-brand"
              >
                Les Restos du Cœur ↗
              </a>{" "}
              - chauffeur-logisticien bénévole depuis 2025 : je livre
              essentiellement sur la zone départementale, parfois plus loin.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground/70">
          Côté loisirs : la musique, la cuisine, la littérature, et les
          voyages... le monde est un terrain de jeu !
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="mt-3 text-foreground/70">
          Envie d&apos;en savoir plus, de me proposer une collaboration ou
          simplement de discuter projets informatiques ?
        </p>
        <a
          href="mailto:vincent.hernandes@gmail.com"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Me contacter
        </a>
      </section>
    </div>
  );
}
