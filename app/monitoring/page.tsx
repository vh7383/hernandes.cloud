import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring — hernandes.cloud",
};

// Placeholder : le vrai contenu (statut des services + embed Elastic réveillé
// à la demande) arrive avec le sous-système réveil/veille, cf. docs/architecture.md.
export default function MonitoringPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
      <p className="mt-3 text-foreground/70">
        Bientôt disponible : statut en direct de mes services et tableau de
        bord Elastic.
      </p>
    </div>
  );
}
