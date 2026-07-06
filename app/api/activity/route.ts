import { NextResponse } from "next/server";
import { getLastActivity } from "@/lib/activityTracker";
import type { WakeTargetName } from "@/lib/wakeTargets";

function isValidTarget(value: unknown): value is WakeTargetName {
  return value === "desktop" || value === "kali";
}

// Consommé par le script de veille local du Desktop (polling), jamais par le
// Pi vers le Desktop — cf. docs/architecture.md, sens de communication à
// sens unique voulu pour ne jamais ouvrir d'accès entrant sur le Desktop.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");

  if (!isValidTarget(target)) {
    return NextResponse.json({ error: "Cible invalide." }, { status: 400 });
  }

  return NextResponse.json({
    target,
    lastActivity: getLastActivity(target),
  });
}
