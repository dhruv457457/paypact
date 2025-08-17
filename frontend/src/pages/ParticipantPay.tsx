import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";
import { FaMoneyBillWave } from "react-icons/fa";
import { ensureFirebaseAuth } from "../lib/firebase";
import { getPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL } from "../lib/solanapay";
import { createConnection } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";

import PaymentQR from "../components/PaymentQR";

// Define the data structures for a participant and a pact
type Participant = { email?: string; wallet?: string; reference?: string; paid?: boolean; paidTx?: string };
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

// Component to handle the payment page for a single participant
export default function ParticipantPay() {
  const { pactId, index } = useParams();
  const participantIndex = Number(index);

  const wallet = useSolanaWallet();
  const { accounts } = wallet;
  const connected = !!accounts?.[0];
  const { provider, status } = useWeb3Auth();

  const [pact, setPact] = useState<PactDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch Firebase auth state on component load
  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  // Fetch the pact document from Firestore
  useEffect(() => {
    if (!pactId || isNaN(participantIndex)) {
      setErr("Invalid pact or participant index.");
      setLoading(false);
      return;
    }

    const fetchPact = async () => {
      try {
        const doc = await getPact(pactId);
        if (!doc) {
          setErr("Pact not found.");
        } else {
          setPact(doc as PactDoc);
        }
      } catch (e: any) {
        setErr(e?.message || "Failed to load pact.");
      } finally {
        setLoading(false);
      }
    };

    fetchPact();
  }, [pactId, participantIndex]);

  const participant = useMemo(() => {
    if (!pact) return null;
    return pact.participants[participantIndex];
  }, [pact, participantIndex]);

  // Handle loading and error states
  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!pact || !participant) return <div className="p-6 text-red-600">Participant not found in this pact.</div>;
  if (participant.paid) return <div className="p-6 text-green-600">This payment has already been made! ✅</div>;

  // Generate Solana Pay URL
  const payUrl = makePayURL({
    recipient: pact.receiverWallet,
    amount: pact.amountPerPerson,
    reference: participant.reference || "",
    label: pact.name,
    message: `Pact payment for ${participant.email || participant.wallet}`,
  }).toString();

  const handlePayWithWallet = async () => {
    try {
      if (!connected) throw new Error("Connect embedded wallet first");
      if (!provider || typeof (provider as any).request !== "function") {
        throw new Error("Embedded wallet not connected");
      }

      const signer = provider;
      const conn = await createConnection();

      const sig = await payWithConnectedWalletSDK({
        conn,
        signer,
        payer: accounts[0],
        recipient: pact.receiverWallet,
        amount: pact.amountPerPerson,
        reference: participant.reference,
      });

      await markParticipantPaid(pact.id, participantIndex, sig);
      alert("Payment successful!");
      window.location.reload(); // Reload to show updated status
    } catch (e: any) {
      alert(e?.message || "Payment failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-24">
      <div className="relative z-10 max-w-2xl mx-auto p-6 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Pay for: {pact.name}</h2>
        <div className="text-gray-400 mb-6">
          <p>You owe {pact.amountPerPerson} SOL to {pact.receiverWallet}</p>
          <p>Due: {new Date(pact.dueDate).toLocaleString()}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <PaymentQR url={payUrl} />
          </div>

          <div className="text-sm text-gray-300">
            Scan this QR code with a mobile wallet or click a button below.
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#7f48de] text-white rounded-md hover:bg-[#7437DC] transition-colors flex items-center gap-2"
            >
              <FaMoneyBillWave /> Open in Wallet
            </a>
            
            {connected && (
              <button
                onClick={handlePayWithWallet}
                disabled={!connected}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Pay with Connected Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}