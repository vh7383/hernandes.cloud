import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getLastActivity } from "@/lib/activityTracker";
import { isReachable } from "@/lib/reachability";
import { wakeTargets } from "@/lib/wakeTargets";

const execFileAsync = promisify(execFile);

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
// Cohérent avec le seuil du script Desktop (scripts/desktop-sleep-watcher.ps1).
const IDLE_THRESHOLD_MS = 15 * 60 * 1000;

// La clé dédiée Pi -> Kali (restreinte à `systemctl suspend` côté Kali, cf.
// docs/decisions.md) vit sur le Pi, pas dans ce repo. Chemin/utilisateur
// configurables : à fixer précisément au déploiement (tâche Dockerisation).
const KALI_SSH_KEY_PATH = process.env.KALI_SSH_KEY_PATH ?? "/root/.ssh/id_ed25519_kali";
const KALI_SSH_USER = process.env.KALI_SSH_USER ?? "vincent";

let started = false;

/**
 * Démarre le planificateur qui endort Kali après inactivité. Contrairement
 * au Desktop (qui décide lui-même, cf. architecture.md), Kali est une
 * machine dédiée sans usage interactif concurrent : le Pi peut donc piloter
 * sa mise en veille directement via SSH, sans double vérification d'idle
 * local.
 */
export function startKaliSleepScheduler(): void {
  if (started) return; // évite un double démarrage (rebuilds, hot-reload, etc.)
  started = true;
  setInterval(() => {
    checkAndSleepKali().catch((error) => {
      console.error("[kali-sleep] Erreur inattendue :", error);
    });
  }, CHECK_INTERVAL_MS);
}

async function checkAndSleepKali(): Promise<void> {
  const kali = wakeTargets.kali;

  const lastActivity = getLastActivity("kali");
  if (lastActivity !== null && Date.now() - lastActivity < IDLE_THRESHOLD_MS) {
    return; // consultée récemment (cf. lib/status.ts qui enregistre l'activité)
  }

  const up = await isReachable(kali.ip, kali.checkPort, 3000);
  if (!up) return; // déjà endormie (ou pas encore réveillée manuellement)

  try {
    await execFileAsync("ssh", [
      "-i",
      KALI_SSH_KEY_PATH,
      "-o",
      "StrictHostKeyChecking=no",
      "-o",
      "ConnectTimeout=5",
      `${KALI_SSH_USER}@${kali.ip}`,
    ]);
    console.log("[kali-sleep] Kali mise en veille après inactivité.");
  } catch (error) {
    console.error("[kali-sleep] Échec de la mise en veille distante :", error);
  }
}
