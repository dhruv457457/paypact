import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";
import { FaMoneyBillWave, FaCheckCircle, FaCopy, FaExternalLinkAlt, FaUserClock, FaUserCheck } from "react-icons/fa";

import { ensureFirebaseAuth } from "../lib/firebase";
import { listenPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL, makeCompatURL } from "../lib/solanapay";
import { createConnection } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";

import PaymentQR from "../components/PaymentQR";

// --- Type Definitions ---
type Participant = { email?: string; wallet?: string; reference?: string; paid?: boolean; i: number };
type PactDoc = {
  id: string;
  name: string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string;
  createdBy?: string;
  participants: Participant[];
  createdAt?: any;
};

// --- Helper Function ---
const truncateIdentifier = (identifier: string) => {
  if (identifier.includes('@')) {
    const [user, domain] = identifier.split('@');
    return `${user.substring(0, 4)}...@${domain}`;
  }
  // For wallets or other strings
  return `${identifier.substring(0, 4)}...${identifier.substring(identifier.length - 4)}`;
};

// --- Helper UI Components ---
const SuccessAnimation = () => (
  <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center z-50">
    <div className="relative">
      <div className="w-24 h-24 bg-green-500/20 rounded-full animate-ping" />
      <div className="absolute inset-0 flex items-center justify-center">
        <FaCheckCircle className="text-5xl text-green-400" />
      </div>
    </div>
    <h2 className="text-2xl font-semibold text-white mt-6">Payment Successful!</h2>
  </div>
);

const ConfirmationModal = ({ pact, participant, onConfirm, onCancel, isLoading }: { pact: PactDoc, participant: Participant, onConfirm: () => void, onCancel: () => void, isLoading: boolean }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
      <h3 className="text-xl font-semibold text-white mb-2">Confirm Payment</h3>
      <p className="text-gray-400 mb-6">
        Pay <strong className="text-purple-400 font-bold">{pact.amountPerPerson} SOL</strong> for{" "}
        <strong className="text-white">{truncateIdentifier(participant.email || participant.wallet || `Participant ${participant.i + 1}`)}</strong>?
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
          {isLoading ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  </div>
);

const CLUSTER = (import.meta.env.VITE_CLUSTER as "mainnet-beta" | "devnet" | "testnet" | undefined) || "mainnet-beta";

// --- Main Component ---
export default function PactDetails() {
  const { id } = useParams();
  const wallet = useSolanaWallet();
  const { accounts } = wallet;
  const connected = !!accounts?.[0];
  const { provider } = useWeb3Auth();

  const [pact, setPact] = useState<PactDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    ensureFirebaseAuth();
    if (!id) return;
    const unsub = listenPact(id, (doc) => {
      setPact(doc as PactDoc);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [id]);
  
  useEffect(() => {
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => setPaymentStatus('idle'), 2500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  const { unpaid, paid } = useMemo(() => {
    const participants = (pact?.participants || []).map((p, i) => ({ ...p, i }));
    return {
      unpaid: participants.filter((p) => !p.paid),
      paid: participants.filter((p) => p.paid),
    };
  }, [pact]);

  const handlePayWithWallet = async () => {
    if (!pact || !selectedParticipant) return;
    setPaymentStatus('processing');

    try {
      if (!connected || !provider || typeof (provider as any).request !== 'function') throw new Error("Wallet not connected properly");
      if (!selectedParticipant.reference) throw new Error("Participant reference missing");

      const sig = await payWithConnectedWalletSDK({
        conn: await createConnection(),
        signer: provider,
        payer: accounts![0],
        recipient: pact.receiverWallet,
        amount: pact.amountPerPerson,
        reference: selectedParticipant.reference,
      });

      await markParticipantPaid(pact.id, selectedParticipant.i, sig);
      setPaymentStatus('success');
    } catch (e: any) {
      alert(e?.message || "Payment failed");
      setPaymentStatus('error');
    } finally {
      setIsModalOpen(false);
    }
  };

  const hasEmbedded = !!provider && typeof (provider as any).request === "function" && connected;
  const isNonMainnet = CLUSTER !== "mainnet-beta";

  if (paymentStatus === 'success') return <SuccessAnimation />;
  if (loading) return <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">Loading Pact Details...</div>;
  if (err) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-red-500">{err}</div>;
  if (!pact) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-red-500">Pact not found.</div>;

  return (
    <>
      {isModalOpen && pact && selectedParticipant && (
        <ConfirmationModal
          pact={pact}
          participant={selectedParticipant}
          onConfirm={handlePayWithWallet}
          onCancel={() => setIsModalOpen(false)}
          isLoading={paymentStatus === 'processing'}
        />
      )}
      <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-14 pb-12">
        <div className="relative z-10 mx-auto p-4 sm:px-40 space-y-8 border-t border-[#1C1C1E] ">
          {isNonMainnet && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-md">
              You're on <b>{CLUSTER}</b>. Ensure your mobile wallet is also on <b>{CLUSTER}</b>.
            </div>
          )}

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-1">{pact.name}</h2>
            <p className="text-sm text-gray-400">
              Amount: <span className="font-semibold text-purple-400">{pact.amountPerPerson} SOL</span> • Due: {new Date(pact.dueDate).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1 truncate px-4">To: {pact.receiverWallet}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- UNPAID SECTION --- */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaUserClock className="text-yellow-400" /> Unpaid ({unpaid.length})
              </h3>
              <div className="space-y-4">
                {unpaid.map((p) => {
                  const who = p.email || p.wallet || `Participant ${p.i + 1}`;
                  const url = makePayURL({
                    recipient: pact.receiverWallet, amount: pact.amountPerPerson, reference: p.reference,
                    label: pact.name, message: `Payment for ${who}`, cluster: CLUSTER
                  }).toString();

                  return (
                    <div key={p.i} className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-4 flex  items-center gap-4">
                      <PaymentQR url={url} />
                      <div className="text-sm text-center w-full space-y-3">
                        <p className="font-semibold text-white truncate" title={who}>
                          {truncateIdentifier(who)}
                        </p>
                        <p className="text-gray-500 text-xs font-mono truncate" title={p.reference}>
                          Ref: {p.reference ? truncateIdentifier(p.reference) : "-"}
                        </p>
                        <div className="flex flex-col justify-center gap-2">
                          <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-md bg-[#1C1C1E] border border-[#3A3A3C] hover:border-purple-500 transition-colors"><FaExternalLinkAlt /> Open Link</a>
                          <button className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-md bg-[#1C1C1E] border border-[#3A3A3C] hover:border-purple-500 transition-colors" onClick={() => navigator.clipboard.writeText(url)}><FaCopy /> Copy URL</button>
                          {hasEmbedded && !!p.reference && (
                            <button onClick={() => { setSelectedParticipant(p); setIsModalOpen(true); }} className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-md bg-[#7f48de] cursor-pointer hover:bg-[#7437DC] font-semibold text-white transition-colors">
                              <FaMoneyBillWave /> Pay for Them
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {unpaid.length === 0 && <div className="text-sm text-green-400 text-center py-4 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl lg:min-h-[380px]">All participants have paid! 🎉</div>}
              </div>
            </div>

            {/* --- PAID SECTION --- */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaUserCheck className="text-green-400" /> Paid ({paid.length})
              </h3>
              <div className="space-y-3 ">
                {paid.map((p) => (
                  <div key={p.i} className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-4 text-sm lg:min-h-[380px]">
                    <p className="font-semibold text-white truncate" title={p.email || p.wallet}>
                      {truncateIdentifier(p.email || p.wallet || `Participant ${p.i + 1}`)}
                    </p>
                    <p className="text-green-400 text-xs">✅ Paid</p>
                  </div>
                ))}
                {paid.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl lg:min-h-[380px]">No payments received yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}