import net from "node:net";

/**
 * Vérifie qu'un port TCP répond, sans présumer du protocole applicatif
 * (Ollama, Kibana, etc.) — un simple connect suffit à savoir si le service
 * est démarré. On pourra affiner en HTTP HEAD une fois les vrais services
 * en place si besoin de vérifier plus qu'un port ouvert.
 */
export function isReachable(ip: string, port: number, timeoutMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const finish = (result: boolean) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(port, ip);
  });
}
