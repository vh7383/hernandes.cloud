function PlaceholderCard({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border px-6 text-center text-sm text-foreground/60">
      {message}
    </div>
  );
}

// Slot prêt pour le futur dashboard Kibana/Grafana curé et anonymisé (cf.
// docs/decisions.md) : l'activation se fera par une simple variable d'env,
// sans redeploy de code, une fois le dashboard public configuré côté Kali.
export default function MonitoringEmbed({ available }: { available: boolean }) {
  const embedUrl = process.env.NEXT_PUBLIC_MONITORING_EMBED_URL;

  if (!available) {
    return (
      <PlaceholderCard message="Le service de monitoring est actuellement en veille — réveil manuel nécessaire (pas de Wake-on-LAN automatique en Wi-Fi, cf. docs/architecture.md)." />
    );
  }

  if (!embedUrl) {
    return (
      <PlaceholderCard message="Service en ligne, mais le tableau de bord public n'est pas encore configuré." />
    );
  }

  return (
    <iframe
      src={embedUrl}
      className="h-[600px] w-full rounded-lg border border-border"
      loading="lazy"
      title="Tableau de bord monitoring"
    />
  );
}
