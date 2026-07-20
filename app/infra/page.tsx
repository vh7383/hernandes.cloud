import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Infrastructure — hernandes.cloud",
};

export default function InfraPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Mon infrastructure</h1>
      <p className="mt-4 text-foreground/70">
        hernandes.cloud n&apos;est pas juste un site : c&apos;est la porte
        d&apos;entrée d&apos;un petit système auto-hébergé, chez moi. Cette
        page explique comment il est construit, et pourquoi — les services
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
          Quatre rôles, quatre machines, chacune avec un usage précis :
        </p>
        <ul className="mt-4 space-y-3 text-sm text-foreground/70">
          <li>
            <strong className="text-foreground">Raspberry Pi</strong> — seule
            machine exposée publiquement, allumée 24/7. Reverse proxy nginx,
            ce site en conteneur Docker, quelques services auto-hébergés
            (Nextcloud, Vaultwarden, Grafana, Plex).
          </li>
          <li>
            <strong className="text-foreground">NAS Synology</strong> —
            stockage et services applicatifs DSM (photos, notes, fichiers,
            vidéosurveillance...), exposés via le même reverse proxy.
          </li>
          <li>
            <strong className="text-foreground">Desktop</strong>{" "}— poste de
            travail interactif quotidien. C&apos;est délibérément la machine
            la plus protégée du lot.
          </li>
          <li>
            <strong className="text-foreground">Kali</strong> — machine
            dédiée monitoring/sécurité, réveillée à la demande pour la démo.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Topologie réseau</h2>
        <p className="mt-3 text-foreground/70">
          Générée par un script perso qui découvre le LAN, plutôt que
          dessinée à la main — routeur, switch, WiFi, et ce qui est branché
          derrière. Noms et adresses réels remplacés par des rôles génériques.
          Le pont domotique pilote aussi de l&apos;éclairage en Zigbee,
          un réseau à part, invisible depuis le LAN — d&apos;où le trait en
          pointillés.
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
          Une seule machine exposée publiquement (le Pi), les autres réveillées
          ou éteintes selon leur usage réel — pensé pour limiter la surface
          d&apos;exposition, pas par souci de simplicité.
        </p>
      </section>
    </div>
  );
}
