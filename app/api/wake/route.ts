import { NextResponse } from "next/server";
import { wakeTargets, type WakeTargetName } from "@/lib/wakeTargets";
import { sendMagicPacket } from "@/lib/wol";
import { isReachable } from "@/lib/reachability";
import { recordActivity } from "@/lib/activityTracker";
import { consumeToken, getClientIp } from "@/lib/rateLimit";

function isValidTarget(value: unknown): value is WakeTargetName {
  return value === "desktop" || value === "kali";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!consumeToken(`wake:${ip}`)) {
    return NextResponse.json(
      { error: "Trop de requêtes, réessaie dans un instant." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const target = body?.target;

  if (!isValidTarget(target)) {
    return NextResponse.json({ error: "Cible invalide." }, { status: 400 });
  }

  const config = wakeTargets[target];

  const alreadyUp = await isReachable(config.ip, config.checkPort);
  if (alreadyUp) {
    recordActivity(target);
    return NextResponse.json({ status: "already-up" });
  }

  if (!config.wakeable || !config.mac) {
    return NextResponse.json(
      {
        status: "unavailable",
        message: "Cette machine doit être réveillée manuellement pour le moment.",
      },
      { status: 503 },
    );
  }

  await sendMagicPacket(config.mac);
  recordActivity(target);
  return NextResponse.json({ status: "waking" });
}
