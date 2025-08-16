// src/pages/MyPacts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../lib/firebase";
import {
  listPactsForWallet,
  findParticipantIndexByWallet,
} from "../lib/pacts";
import { FaCopy, FaExternalLinkAlt, FaMoneyBillWave } from "react-icons/fa";

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

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pacts, setPacts] = useState<PactDoc[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  
  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${link}`);
      setCopiedLink(link);

      // Reset after 2 sec to show "Copied!"
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // 1) Wait for Firebase auth (anon in dev) BEFORE any Firestore reads
  useEffect(() => {
    (async () => {
      try {
        await ensureFirebaseAuth();
        setReady(true);
      } catch (e: any) {
        setErr(e?.message || "Auth failed");
        setLoading(false);
      }
    })();
  }, []);

  // 2) Load pacts once auth is ready and wallet is connected
  useEffect(() => {
    if (!ready) return;
    if (!wallet) { setLoading(false); return; }

    (async () => {
      setLoading(true);
      try {
        const indexed = await listPactsForWallet(wallet);
        setPacts(indexed as any);
      } catch (e: any) {
        setErr(e?.message || "Failed to load pacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, wallet]);

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
    return <div className="p-6">Please connect your wallet first.</div>;
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

 return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-24">
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-semibold text-white text-center">My Pacts</h2>

        {rows.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>You are not a participant in any pacts yet.</p>
            <p className="mt-2">When someone adds you to a pact, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map(({ pact, idx, me, paidCount, total }) => {
              const myStatus = me?.paid ? "Paid" : "Unpaid";
              const myLink = idx >= 0 ? `/pay/${pact.id}/${idx}` : null;
              const progress = total > 0 ? (paidCount / total) * 100 : 0;

              return (
                <div key={pact.id} className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{pact.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Amount: <span className="font-semibold text-purple-400">{pact.amountPerPerson} SOL</span>
                        </p>
                         <p className="text-xs text-gray-500 font-mono mt-1">
                           To: {pact.receiverWallet}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className={`text-sm font-semibold px-3 py-1 rounded-full ${me?.paid ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                           Your Status: {myStatus}
                         </div>
                         <Link to={`/pact/${pact.id}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                           View Details <FaExternalLinkAlt/>
                         </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                        <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                            <span>Group Progress</span>
                            <span>{paidCount} / {total} Paid</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700">
                           <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full" style={{ width: `${progress}%` }}/>
                        </div>
                    </div>
                  </div>

                  {myLink && !me?.paid && (
                    <div className="bg-black/30 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
                       <p className="text-sm text-gray-300">It's your turn to pay.</p>
                       <div className="flex items-center gap-3">
                          <button
                            className="flex items-center gap-2 text-xs px-3 py-2 border border-[#3A3A3C] rounded-md hover:bg-[#1C1C1E] transition-colors"
                            onClick={() => handleCopyLink(myLink)}
                          >
                            <FaCopy /> {copiedLink === myLink ? 'Copied!' : 'Copy Payment Link'}
                          </button>
                           <Link to={myLink} className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-[#7f48de] hover:bg-[#7437DC] transition-colors font-semibold">
                              <FaMoneyBillWave/> Pay Now
                           </Link>
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}