import dgram from "node:dgram";

function macToBytes(mac: string): Buffer {
  const hex = mac.replace(/[:-]/g, "");
  if (hex.length !== 12) {
    throw new Error(`Adresse MAC invalide : ${mac}`);
  }
  return Buffer.from(hex, "hex");
}

/**
 * Envoie un magic packet Wake-on-LAN en broadcast UDP sur le LAN.
 * Ne nécessite aucun credential : c'est un datagramme non authentifié, le
 * Pi et la cible doivent juste partager le même segment réseau.
 */
export async function sendMagicPacket(
  mac: string,
  broadcastAddress = "192.168.1.255",
  port = 9,
): Promise<void> {
  const macBytes = macToBytes(mac);
  // Format du magic packet : 6 octets 0xFF suivis de la MAC répétée 16 fois.
  const packet = Buffer.concat([Buffer.alloc(6, 0xff), Buffer.concat(Array(16).fill(macBytes))]);

  const socket = dgram.createSocket("udp4");
  try {
    await new Promise<void>((resolve, reject) => {
      socket.bind(() => {
        socket.setBroadcast(true);
        socket.send(packet, 0, packet.length, port, broadcastAddress, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  } finally {
    socket.close();
  }
}
