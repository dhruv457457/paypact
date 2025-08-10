// src/lib/solanapay.ts
import { encodeURL, createQR } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export function makePayURL({
  recipient,            // receiver wallet (string)
  amount,               // number, SOL units
  reference,            // ref pubkey (string)
  label,
  message,
  splToken,             // optional SPL mint (string)
}: {
  recipient: string;
  amount: number;
  reference: string;
  label: string;
  message?: string;
  splToken?: string;
}) {
  return encodeURL({
    recipient: new PublicKey(recipient),
    amount: new BigNumber(amount),
    reference: new PublicKey(reference),
    label,
    message,
    ...(splToken ? { splToken: new PublicKey(splToken) } : {}),
  });
}

export function renderQR(containerEl: HTMLElement, url: URL) {
  containerEl.replaceChildren();
  const qr = createQR(url, 256, "transparent");
  qr.append(containerEl);
}

/**
 * Backwards-compatible helper so existing code that calls
 * buildSolanaPayURL({ receiver, ... }) keeps working.
 * Returns a string URL.
 */
export function buildSolanaPayURL(args: {
  recipient?: string;        // preferred
  receiver?: string;         // legacy param your code used
  amount: number;
  reference: string;
  label: string;
  message?: string;
  splToken?: string;
}): string {
  const recipient = args.recipient || args.receiver;
  if (!recipient) throw new Error("recipient/receiver is required");
  return makePayURL({
    recipient,
    amount: args.amount,
    reference: args.reference,
    label: args.label,
    message: args.message,
    splToken: args.splToken,
  }).toString();
}
