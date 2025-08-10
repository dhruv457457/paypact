import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ensureFirebaseAuth } from "../lib/firebase";
import { listenPact, markParticipantPaid } from "../lib/pacts";
import PaymentQR from "../components/PaymentQR";

type Participant = {
  email?: string;
  wallet?: string;
  reference?: string;
  paid?: boolean;
};

type PactDoc = {
  id: string;
  name: string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string; // ISO
  createdBy?: string;
  participants: Participant[];
  createdAt?: any;
};

export default function PactDetails() {
  const { id } = useParams();
  const [pact, setPact] = useState<PactDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    if (!id) return;
    const unsub = listenPact(id, (doc) => {
      setPact(doc as PactDoc);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [id]);

  const unpaid = useMemo(
    () => (pact?.participants || []).map((p, i) => ({ ...p, i })).filter(p => !p.paid),
    [pact]
  );
  const paid = useMemo(
    () => (pact?.participants || []).map((p, i) => ({ ...p, i })).filter(p => p.paid),
    [pact]
  );

  // Build a Solana Pay URL without external helpers (works fine for wallets)
  const buildSolanaPayUrl = (receiver: string, amount: number, ref: string, label: string, message: string) => {
    const params = new URLSearchParams();
    params.set("amount", String(amount));
    if (ref) params.set("reference", ref);
    if (label) params.set("label", label);
    if (message) params.set("message", message);
    return `solana:${receiver}?${params.toString()}`;
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!pact) return <div className="p-6 text-red-600">Pact not found.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-1">{pact.name}</h2>
      <div className="text-sm text-gray-600 mb-6">
        Receiver: <span className="font-mono">{pact.receiverWallet}</span> •{" "}
        Amount/Person: <b>{pact.amountPerPerson}</b> • Due:{" "}
        {new Date(pact.dueDate).toLocaleString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Unpaid */}
        <div>
          <h3 className="font-medium mb-3">Unpaid ({unpaid.length})</h3>
          <div className="space-y-4">
            {unpaid.map((p) => {
              const label = pact.name;
              const who = p.email || p.wallet || `P${p.i + 1}`;
              const message = `Payment for ${who}`;
              const url = buildSolanaPayUrl(
                pact.receiverWallet,
                pact.amountPerPerson,
                p.reference || "",
                label,
                message
              );

              return (
                <div key={p.i} className="border rounded-lg p-3 flex gap-3 items-center">
                  <PaymentQR url={url} />
                  <div className="flex-1 text-sm">
                    <div className="mb-1"><b>Participant:</b> {who}</div>
                    <div className="break-all text-gray-600">ref: {p.reference || "-"}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open link
                      </a>
                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => navigator.clipboard.writeText(url)}
                      >
                        Copy URL
                      </button>
                      {/* Temporary manual control; replace with webhook later */}
                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => markParticipantPaid(pact.id, p.i)}
                      >
                        Mark Paid (manual)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {unpaid.length === 0 && <div className="text-sm text-green-700">All paid 🎉</div>}
          </div>
        </div>

        {/* Paid */}
        <div>
          <h3 className="font-medium mb-3">Paid ({paid.length})</h3>
          <div className="space-y-2">
            {paid.map((p) => (
              <div key={p.i} className="border rounded-lg p-3 text-sm">
                <div><b>Participant:</b> {p.email || p.wallet || `P${p.i + 1}`}</div>
                {/* When you add webhook verification, store txSig + time and show here */}
                <div className="text-gray-600">Status: ✅ Paid</div>
              </div>
            ))}
            {paid.length === 0 && <div className="text-sm text-gray-600">No payments yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
