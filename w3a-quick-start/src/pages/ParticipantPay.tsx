import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ensureFirebaseAuth } from "../lib/firebase";
import { getPact, markParticipantPaid } from "../lib/pacts";
import PaymentQR from "../components/PaymentQR";

export default function ParticipantPay() {
  const { pactId, index } = useParams();
  const [pact, setPact] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const idx = Number(index);

  useEffect(() => { ensureFirebaseAuth(); }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!pactId || Number.isNaN(idx)) return;
        const p = await getPact(pactId);
        if (!p) { setErr("Pact not found"); return; }
        if (!p.participants?.[idx]) { setErr("Participant not found"); return; }
        setPact(p);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [pactId, idx]);

  const participant = useMemo(() => pact?.participants?.[idx], [pact, idx]);

  // Build Solana Pay URL (manual builder to avoid extra deps)
  const payUrl = useMemo(() => {
    if (!pact || !participant) return "";
    const params = new URLSearchParams();
    params.set("amount", String(pact.amountPerPerson));
    if (participant.reference) params.set("reference", participant.reference);
    params.set("label", pact.name || "PayPact");
    params.set("message", `Payment for ${participant.email || participant.wallet || `P${idx+1}`}`);
    return `solana:${pact.receiverWallet}?${params.toString()}`;
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
        Receiver: <span className="font-mono">{pact.receiverWallet}</span> • Amount: <b>{pact.amountPerPerson}</b>
      </div>

      <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
        <div className="text-sm">Pay as: <b>{who}</b></div>
        <PaymentQR url={payUrl} />
        <div className="flex flex-wrap gap-2 text-sm">
          <a className="text-blue-600 underline" href={payUrl}>Open in wallet</a>
          <button className="px-2 py-1 border rounded" onClick={() => navigator.clipboard.writeText(payUrl)}>Copy link</button>
        </div>
        {isPaid ? (
          <div className="text-green-700 text-sm">✅ Already paid {participant.paidTx ? <a className="underline text-blue-600" target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${participant.paidTx}?cluster=devnet`}>view tx</a> : ""}</div>
        ) : (
          <div className="text-xs text-gray-600">No camera? Tap “Open in wallet” or copy the link and paste it into your wallet’s browser.</div>
        )}
      </div>

      {/* TEMP: manual mark paid; webhook should do this automatically */}
      {!isPaid && (
        <div className="mt-3">
          <button className="text-xs px-2 py-1 border rounded" onClick={() => markParticipantPaid(pact.id, idx)}>
            Mark Paid (manual)
          </button>
        </div>
      )}
    </div>
  );
}
