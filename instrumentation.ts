export async function register() {
  // Uniquement côté serveur Node (pas d'edge runtime, pas de build statique) :
  // ce planificateur maintient un setInterval vivant pour toute la durée de
  // vie du conteneur, cf. lib/kaliSleepScheduler.ts.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startKaliSleepScheduler } = await import("@/lib/kaliSleepScheduler");
    startKaliSleepScheduler();
  }
}
