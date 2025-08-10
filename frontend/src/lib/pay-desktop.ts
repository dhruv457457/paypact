// src/lib/pay-desktop.ts
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

/** Normalize Phantom vs Web3Auth Solana provider */
function makeSigner(provider: any) {
  if (!provider) throw new Error("No Solana provider");
  // Phantom or other wallet-injected providers
  if (provider.isPhantom || provider.signAndSendTransaction || provider.signTransaction) {
    return provider;
  }
  // Web3Auth Solana provider RPC bridge
  if (provider.request) {
    return {
      signAndSendTransaction: async (tx: Transaction) => {
        const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
        const message = bs58.encode(serialized);
        const res = await provider.request({
          method: "solana_signAndSendTransaction",
          params: { message },
        });
        const signature = typeof res === "string" ? res : res?.signature;
        return { signature };
      },
      signTransaction: undefined,
    };
  }
  throw new Error("Unsupported Solana provider");
}

/**
 * Desktop payment using connected wallet (Phantom or Web3Auth Embedded).
 * Adds the Solana Pay reference as a readonly key on the transfer ix.
 */
export async function payWithConnectedWalletSDK({
  conn,
  provider,
  payer,
  recipient,
  amount,
  reference,
}: {
  conn: Connection;
  provider: any;            // (window as any).solana OR useSolanaWallet().provider
  payer: string;            // base58
  recipient: string;        // base58
  amount: number;           // SOL units
  reference: string;        // base58 (32 bytes)
}) {
  if (!payer) throw new Error("Missing payer");
  if (!recipient) throw new Error("Missing recipient");
  if (!reference) throw new Error("Missing reference");

  const from = new PublicKey(payer);
  const to = new PublicKey(recipient);
  const refPk = new PublicKey(reference);

  const ix = SystemProgram.transfer({
    fromPubkey: from,
    toPubkey: to,
    lamports: Math.round(amount * 1e9),
  });

  // Attach reference (readonly, non-signer)
  ix.keys.push({ pubkey: refPk, isSigner: false, isWritable: false });

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  const tx = new Transaction({ feePayer: from, recentBlockhash: blockhash }).add(ix);

  const signer = makeSigner(provider);

  if (signer.signAndSendTransaction) {
    const { signature } = await signer.signAndSendTransaction(tx);
    await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
    return signature;
  }

  if (!signer.signTransaction) throw new Error("Wallet cannot signTransaction");
  const signed = await signer.signTransaction(tx);
  const sig = await conn.sendRawTransaction(signed.serialize());
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
  return sig;
}
