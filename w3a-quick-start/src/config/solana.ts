import { Connection } from "@solana/web3.js";

const ENDPOINTS = [
  "https://rpc.ankr.com/solana_devnet",
  "https://api.devnet.solana.com",
];

export async function createConnection() {
  for (const url of ENDPOINTS) {
    try {
      const c = new Connection(url, "confirmed");
      await c.getLatestBlockhash(); // quick probe
      return c;
    } catch {}
  }
  return new Connection(ENDPOINTS[ENDPOINTS.length - 1], "confirmed");
}
