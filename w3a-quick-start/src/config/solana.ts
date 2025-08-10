import { Connection } from "@solana/web3.js";

export const RPC = import.meta.env.VITE_RPC as string;

export const connection = new Connection(RPC, {
  commitment: "processed",
});
