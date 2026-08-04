import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Mermaid from "@/components/Mermaid";

const infraDistribueeDiagram = `flowchart TD
    Internet["Internet"] --> DNS["DNS hernandes.cloud<br/>bascule automatique"]
    DNS -->|"défaut"| VPS["VPS<br/>nginx + TLS<br/>site + API Gabrielle"]
    DNS -.->|"secours si le VPS tombe"| Local["Serveur local<br/>proxy LAN + monitoring"]
    VPS <-->|"mesh VPN"| Local
    VPS -.->|"mesh VPN, privé"| Kali["Kali<br/>poste sécurité<br/>jamais exposée"]
    Local -.->|"mesh VPN, privé"| Kali
`;

export const metadata: Metadata = {
  title: "Infrastructure - hernandes.cloud",
};

export default function InfraPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Mon infrastructure</h1>
      <p className="mt-4 text-foreground/70">
        hernandes.cloud n&apos;est pas juste un site : c&apos;est la porte
        d&apos;entrée de mon petit système auto-hébergé. Cette
        page explique comment il est construit, et pourquoi - les services
        eux-mêmes sont visibles en direct sur{" "}
        <Link href="/services" className="text-brand hover:underline">
          /services
        </Link>{" "}
        et{" "}
        <Link href="/monitoring" className="text-brand hover:underline">
          /monitoring
        </Link>
        .
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Vue d&apos;ensemble</h2>
        <p className="mt-3 text-foreground/70">
          Plusieurs rôles, plusieurs machines, chacune avec un usage précis :
        </p>
        <ul className="mt-4 space-y-3 text-sm text-foreground/70">
          <li>
            <strong className="text-foreground">Serveur local</strong> -
            allumé 24/7. Reverse proxy nginx, secours pour ce site, quelques
            services auto-hébergés (Nextcloud, Vaultwarden, Grafana, Plex).
          </li>
          <li>
            <strong className="text-foreground">NAS Synology</strong> -
            stockage et services applicatifs DSM (photos, notes, fichiers,
            vidéosurveillance...), exposés via le même reverse proxy.
          </li>
          <li>
            <strong className="text-foreground">Desktop</strong>{" "}- poste de
            travail interactif quotidien. C&apos;est délibérément la machine
            la plus protégée du lot.
          </li>
          <li>
            <strong className="text-foreground">Kali</strong> - machine
            dédiée monitoring/sécurité, réveillée à la demande pour la démo.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Topologie réseau</h2>
        <p className="mt-3 text-foreground/70">
          Ce schéma ne couvre que mon réseau local (le homelab) - la partie
          distribuée (VPS, bascule automatique) est détaillée dans
          « Déploiement et résilience » plus bas. Généré par un script perso
          qui découvre le LAN, plutôt que dessiné à la main - routeur,
          switch, WiFi, et ce qui est branché derrière. Noms et adresses
          réels remplacés par des rôles génériques. Le pont domotique pilote
          aussi de l&apos;éclairage en Zigbee, un réseau à part, invisible
          depuis le LAN - d&apos;où le trait en pointillés.
        </p>
        <Image
          src="/images/infra/network-topology.svg"
          alt="Topologie du réseau domestique : routeur, switch, WiFi, et les appareils connectés"
          width={782}
          height={1106}
          className="mt-4 h-auto w-full max-w-md rounded-lg border border-border"
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Pourquoi ces choix</h2>
        <p className="mt-3 text-foreground/70">
          Peu de machines exposées directement, les autres réveillées ou
          éteintes selon leur usage réel - pensé pour limiter la surface
          d&apos;exposition, pas par souci de simplicité.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Déploiement et résilience</h2>
        <p className="mt-3 text-foreground/70">
          Le point d&apos;entrée public n&apos;est plus une seule machine mais
          une propriété du DNS : un VPS sert le trafic par défaut - le site
          et l&apos;API du chatbot Gabrielle - avec bascule automatique vers
          le serveur local en secours si le VPS tombe, et retour automatique
          une fois celui-ci rétabli. Les deux machines restent reliées en
          permanence par un mesh VPN auto-hébergé, dont Kali (mon poste de
          sécurité) fait aussi partie - jamais un point d&apos;entrée public,
          toujours gérée à la main.
        </p>
        <p className="mt-3 text-foreground/70">
          Le déploiement suit un pipeline CI/CD (GitHub Actions) déclenché à
          chaque push sur la branche principale : build d&apos;images Docker
          multi-architecture sur des runners natifs, publication sur un
          registre de conteneurs, puis mise à jour automatisée de la machine
          cible. Comme pour le reste de cette page, la mécanique précise de
          bascule (ports, identifiants, scripts) n&apos;est pas détaillée ici
          - l&apos;idée est de montrer les choix, pas de documenter une cible
          d&apos;attaque.
        </p>
        <Mermaid chart={infraDistribueeDiagram} />
      </section>
    </div>
  );
}
