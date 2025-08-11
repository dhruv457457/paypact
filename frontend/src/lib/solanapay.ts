import { encodeURL, createQR } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export function makePayURL({
  recipient,
  amount,
  reference,
  label,
  message,
  splToken,
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

/** Back-compat for old imports that expect a string return */
export function buildSolanaPayURL(args: {
  recipient?: string;
  receiver?: string; // legacy key
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
