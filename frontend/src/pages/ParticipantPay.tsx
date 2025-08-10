import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

import { ensureFirebaseAuth } from "../lib/firebase";
import { getPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL } from "../lib/solanapay";
import { createConnection } from "../config/solana"; // keep your path
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";

import PaymentQR from "../components/PaymentQR";

export default function ParticipantPay() {
  const { pactId, index } = useParams();
  const idx = Number(index);

  // ✅ use connection from useSolanaWallet
  const { accounts, connection } = useSolanaWallet();
  const connected = !!accounts?.[0];
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const [pact, setPact] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!pactId || Number.isNaN(idx)) return;
        const p = await getPact(pactId);
        if (!p) return setErr("Pact not found");
        if (!p.participants?.[idx]) return setErr("Participant not found");
        setPact(p);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [pactId, idx]);

  const participant = useMemo(() => pact?.participants?.[idx], [pact, idx]);

  const payUrl = useMemo(() => {
    if (!pact || !participant) return "";
    return makePayURL({
      recipient: pact.receiverWallet,
      amount: pact.amountPerPerson,
      reference: participant.reference!,
      label: pact.name || "PayPact",
      message:
        "Payment for " +
        (participant.email || participant.wallet || `P${idx + 1}`),
    }).toString();
  }, [pact, participant, idx]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!pact || !participant) return null;

  const who = participant.email || participant.wallet || `Participant ${idx + 1}`;
  const isPaid = !!participant.paid;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-2">{pact.name}</h2>
      <div className="text-sm text-gray-600 mb-4">
        Receiver: <span className="font-mono">{pact.receiverWallet}</span> •{" "}
        Amount: <b>{pact.amountPerPerson}</b>
      </div>

      <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
        <div className="text-sm">
          Pay as: <b>{who}</b>
        </div>

        <PaymentQR url={payUrl} />

        <div className="flex flex-wrap gap-2 text-sm">
          {/* Mobile deeplink */}
          <a className="text-blue-600 underline" href={payUrl} target="_blank" rel="noreferrer">
            Open in wallet
          </a>

          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={() => navigator.clipboard.writeText(payUrl)}
          >
            Copy link
          </button>

          {/* Desktop fallback: pay with connected wallet (embedded or Phantom) */}
          {!isMobile && connected && !isPaid && participant.reference && (
            <button
              type="button"
              className="px-2 py-1 rounded bg-blue-600 text-white"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation(); // ✅ don’t let the <a href="solana:"> fire
                try {
                  const conn = await createConnection(); // your RPC helper
                  const signer = (window as any).solana || connection; // Phantom OR Web3Auth embedded
                  if (!signer) throw new Error("No Solana wallet connected");
                  const sig = await payWithConnectedWalletSDK({
                    conn,
                    provider: signer,
                    payer: accounts![0],
                    recipient: pact.receiverWallet,
                    amount: pact.amountPerPerson,
                    reference: participant.reference!,
                  });
                  await markParticipantPaid(pact.id, idx, sig);
                  alert("Paid!\n" + sig);
                } catch (e: any) {
                  alert(e.message || "Payment failed");
                }
              }}
            >
              Pay with connected wallet
            </button>
          )}
        </div>

        {isPaid ? (
          <div className="text-green-700 text-sm">
            ✅ Already paid{" "}
            {participant.paidTx ? (
              <a
                className="underline text-blue-600"
                target="_blank"
                rel="noreferrer"
                href={`https://explorer.solana.com/tx/${participant.paidTx}?cluster=devnet`}
              >
                view tx
              </a>
            ) : null}
          </div>
        ) : (
          <div className="text-xs text-gray-600">
            No camera? Tap “Open in wallet” or copy the link and paste it into
            your wallet’s browser.
          </div>
        )}
      </div>

      {/* TEMP: manual mark paid; webhook should do this automatically */}
      {!isPaid && (
        <div className="mt-3">
          <button
            type="button"
            className="text-xs px-2 py-1 border rounded"
            onClick={() => markParticipantPaid(pact.id, idx)}
          >
            Mark Paid (manual)
          </button>
        </div>
      )}
    </div>
  );
}
