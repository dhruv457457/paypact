
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";

import { ensureFirebaseAuth } from "../lib/firebase";
import { getPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL } from "../lib/solanapay";
import { createConnection } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";

import PaymentQR from "../components/PaymentQR";

export default function ParticipantPay() {
  const { pactId, index } = useParams();
  const idx = Number(index);

  const wallet = useSolanaWallet();
  const { accounts } = wallet;
  const connected = !!accounts?.[0];
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const { provider, status } = useWeb3Auth();

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
        "Payment for " + (participant.email || participant.wallet || `P${idx + 1}`),
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

          {/* Embedded wallet only; no Phantom fallback */}
          {!isMobile && connected && !isPaid && participant.reference && (
            <button
              type="button"
              className="px-2 py-1 rounded bg-blue-600 text-white"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  if (!connected) throw new Error("Connect embedded wallet first");
                  if (!provider || typeof (provider as any).request !== "function") {
                    console.log("Web3Auth provider missing. Debug:", { status, provider, wallet });
                    throw new Error("Embedded wallet not connected");
                  }

                  const signer = provider; // normalizeSigner handles .request(...)
                  const conn = await createConnection();
                  console.log("Using RPC:", import.meta.env.VITE_RPC);
                         
                  console.log("provider.rpcTarget:", (provider as any)?.rpcTarget);
                  
                  const sig = await payWithConnectedWalletSDK({
                    conn,
                    signer,
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
          <div className="text-green-700 text-sm">✅ Already paid</div>
        ) : (
          <div className="text-xs text-gray-600">
            No camera? Tap “Open in wallet” or copy the link and paste it into your wallet’s
            browser.
          </div>
        )}
      </div>

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
