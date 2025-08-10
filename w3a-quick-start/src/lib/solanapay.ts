import { encodeURL } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export function buildSolanaPayURL(params: {
  receiver: string;     // receiver wallet
  amount: number;       // display units (e.g., 50)
  reference: string;    // unique public key (string)
  label?: string;       // "PayPact"
  message?: string;     // "Payment for <Pact>"
}) {
  const url = encodeURL({
    recipient: new PublicKey(params.receiver),
    amount: new BigNumber(params.amount),
    reference: new PublicKey(params.reference),
    label: params.label ?? "PayPact",
    message: params.message ?? "Payment",
  });
  return url.toString();
}
