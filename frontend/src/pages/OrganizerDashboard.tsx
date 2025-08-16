import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../lib/firebase";
import { listPactsByCreator } from "../lib/pacts";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaUser } from "react-icons/fa";

export default function OrganizerDashboard() {
  const { accounts } = useSolanaWallet();
  const [loading, setLoading] = useState(true);
  const [pacts, setPacts] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    (async () => {
      if (!accounts?.[0]) { setLoading(false); return; }
      try {
        const data = await listPactsByCreator(accounts[0]);
        setPacts(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load pacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [accounts]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

   return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-24">
      <div className="relative z-10 max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-semibold text-white">Organizer Dashboard</h2>
                <p className="text-gray-400 mt-1">An overview of all the pacts you've created.</p>
            </div>
            <Link
             to="/create"
             className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-[#7f48de] hover:bg-[#7437DC] transition-colors font-semibold"
            >
                <FaPlusCircle/> Create New Pact
            </Link>
        </div>

        {pacts.length === 0 ? (
          <div className="text-center border-2 border-dashed border-[#1C1C1E] rounded-xl p-12">
            <h3 className="text-xl font-semibold text-white">You haven't created any pacts yet.</h3>
            <p className="text-gray-500 mt-2">Click the button below to start your first group payment.</p>
             <Link to="/create" className="inline-block mt-6 text-sm px-6 py-2 rounded-md bg-[#7f48de] hover:bg-[#7437DC] transition-colors font-semibold">
                Create a Pact
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacts.map((p: any) => {
               const paidCount = (p.participants || []).filter((x: any) => x.paid).length;
               const total = (p.participants || []).length;
               const progress = total > 0 ? (paidCount / total) * 100 : 0;
               const totalCollected = paidCount * p.amountPerPerson;

              return (
                <Link to={`/pact/${p.id}`} key={p.id} className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-white truncate">{p.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        <span className="font-semibold text-purple-400">{p.amountPerPerson} SOL</span> per person
                      </p>
                      
                      <div className="mt-4">
                          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                              <span>Collection Progress</span>
                              <span>{paidCount} / {total} Paid</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700">
                             <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full" style={{ width: `${progress}%` }}/>
                          </div>
                      </div>
                    </div>
                     <div className="bg-black/30 px-5 py-3 border-t border-[#1C1C1E] text-sm flex justify-between items-center">
                       <div className="flex items-center gap-2 text-gray-400">
                           <FaUser />
                           <span>{total} Participants</span>
                       </div>
                       <span className="font-semibold text-green-400">{totalCollected.toFixed(4)} SOL</span>
                    </div>
                </Link>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}