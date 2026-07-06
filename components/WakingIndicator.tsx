export default function WakingIndicator({ elapsedSeconds }: { elapsedSeconds: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-foreground/70">
      <span className="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
      <span>
        Réveil de la machine en cours ({elapsedSeconds}s)... ça peut prendre jusqu&apos;à une
        minute.
      </span>
    </div>
  );
}
