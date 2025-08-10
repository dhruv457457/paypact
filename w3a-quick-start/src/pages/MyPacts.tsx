import React, { useEffect, useMemo, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../lib/firebase";
import { listPactsForWallet, getPact, findParticipantIndexByWallet } from "../lib/pacts";
import { Link } from "react-router-dom";

type PactDoc = {
  id: string;
  name: string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string;
  createdBy?: string;
  participants: Array<{ wallet?: string; email?: string; paid?: boolean; paidTx?: string }>;
  createdAt?: any;
  participantWallets?: string[];
};

export default function MyPacts() {
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";
  const [loading, setLoading] = useState(true);
  const [pacts, setPacts] = useState<PactDoc[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    (async () => {
      if (!wallet) { setLoading(false); return; }
      try {
        // First try indexed query
        const indexed = await listPactsForWallet(wallet);

        // Fallback (older docs without participantWallets): fetch recent by createdBy and filter in client
        let finalList: PactDoc[] = indexed as any;

        if (finalList.length === 0) {
          // If you want a broader fallback, you could fetch recent pacts and filter,
          // but that can be heavy. We'll keep it simple for now.
        }

        setPacts(finalList as PactDoc[]);
      } catch (e: any) {
        setErr(e?.message || "Failed to load pacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet]);

  const rows = useMemo(() => {
    return pacts.map((p) => {
      const idx = findParticipantIndexByWallet(p, wallet);
      const me = idx >= 0 ? p.participants[idx] : null;
      const paidCount = (p.participants || []).filter((x) => x.paid).length;
      const total = (p.participants || []).length;
      return { pact: p, idx, me, paidCount, total };
    });
  }, [pacts, wallet]);

  if (!wallet) {
    return (
      <div className="p-6">
        Please connect your wallet first.
      </div>
    );
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Pacts</h2>

      {rows.length === 0 ? (
        <div className="text-gray-600">No pacts found for this wallet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ pact, idx, me, paidCount, total }) => {
            const myStatus = me?.paid ? "✅ Paid" : "❌ Unpaid";
            const myLink = idx >= 0 ? `/pay/${pact.id}/${idx}` : null;

            return (
              <div key={pact.id} className="border rounded-lg p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{pact.name}</div>
                    <div className="text-sm text-gray-600">
                      Amount/person: <b>{pact.amountPerPerson}</b> •
                      Receiver: <span className="font-mono">{pact.receiverWallet}</span> •
                      Due: {pact.dueDate ? new Date(pact.dueDate).toLocaleString() : "-"}
                    </div>
                    <div className="text-sm mt-1">
                      Group status: {paidCount}/{total} paid
                    </div>
                    <div className="text-sm">
                      Your status: {myStatus}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link className="text-blue-600 underline" to={`/pact/${pact.id}`}>
                      View pact
                    </Link>
                    {myLink && (
                      <Link className="text-blue-600 underline" to={myLink}>
                        Pay now
                      </Link>
                    )}
                  </div>
                </div>
                {myLink && !me?.paid && (
                  <div className="mt-2">
                    <button
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() => navigator.clipboard.writeText(window.location.origin + myLink)}
                    >
                      Copy my payment link
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
