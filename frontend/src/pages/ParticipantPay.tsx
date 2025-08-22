import React, { useEffect, useState, useMemo } from "react";
// 1. IMPORT useNavigate
import { useParams, useNavigate } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";
import { FaMoneyBillWave, FaCheckCircle, FaCoins, FaSolarPanel, FaWallet, FaCalendarAlt } from "react-icons/fa";

import { ensureFirebaseAuth } from "../lib/firebase";
import { getPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL } from "../lib/solanapay";
import { createConnection } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";
import { checkPinExists, setPin, verifyPin } from "../lib/user";

import PaymentQR from "../components/PaymentQR";
import UpiPinModal from "../components/UpiPinModal";
import LoadingOverlay from "../components/LoadingOverlay";

// --- Type Definitions ---
type Participant = { email?: string; wallet?: string; reference?: string; paid?: boolean; paidTx?: string };
type PactDoc = {
  id: string;
  name:string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string;
  createdBy?: string;
  participants: Participant[];
  createdAt?: any;
  splToken?: string;
};

// --- Helper Components ---
const SuccessAnimation = () => (
    <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-24 h-24 bg-green-500/20 rounded-full animate-ping" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaCheckCircle className="text-5xl text-green-400" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-white mt-6">Payment Successful!</h2>
      <p className="text-gray-400 mt-1">Redirecting you now...</p>
    </div>
);

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="flex justify-between items-center text-left py-3 border-b border-[#1C1C1E]">
        <div className="flex items-center gap-3">
            <div className="text-gray-400">{icon}</div>
            <span className="text-gray-300">{label}</span>
        </div>
        <span className="font-mono text-white font-semibold truncate max-w-[50%]">{value}</span>
    </div>
);

// --- Main Component ---
export default function ParticipantPay() {
  const { pactId, index } = useParams();
  const participantIndex = Number(index);
  // 2. INITIALIZE useNavigate
  const navigate = useNavigate();

  const { accounts } = useSolanaWallet();
  const { provider } = useWeb3Auth();
  const connected = !!accounts?.[0];

  const [pact, setPact] = useState<PactDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<'set' | 'enter'>('enter');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [userHasPin, setUserHasPin] = useState<boolean | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);
  
  useEffect(() => {
    const checkForPin = async () => {
      if (connected && userHasPin === null) {
        try {
          const hasPin = await checkPinExists();
          setUserHasPin(hasPin);
          setPinMode(hasPin ? 'enter' : 'set');
        } catch (error) {
          console.error("Failed to check for PIN:", error);
          setUserHasPin(false);
          setPinMode('set');
        }
      }
    };
    checkForPin();
  }, [connected, userHasPin]);

  useEffect(() => {
    if (!pactId || isNaN(participantIndex)) {
      setErr("Invalid pact or participant index.");
      setLoading(false);
      return;
    }
    const fetchPact = async () => {
      try {
        const doc = await getPact(pactId);
        if (!doc) setErr("Pact not found.");
        else setPact(doc as PactDoc);
      } catch (e: any) {
        setErr(e?.message || "Failed to load pact.");
      } finally {
        setLoading(false);
      }
    };
    fetchPact();
  }, [pactId, participantIndex]);

  const participant = useMemo(() => pact?.participants[participantIndex], [pact, participantIndex]);

  const payUrl = useMemo(() => {
    if (!pact || !participant) return "";
    return makePayURL({
      recipient: pact.receiverWallet,
      amount: pact.amountPerPerson,
      reference: participant.reference || "",
      splToken: pact.splToken,
      label: pact.name,
      message: `Pact payment for ${participant.email || participant.wallet}`,
    }).toString();
  }, [pact, participant]);
  
  const executePayment = async () => {
    if (!pact || !participant) return;
    setIsPinModalOpen(false);
    setPaymentStatus('processing');

    try {
      if (!connected || !provider || !accounts?.[0]) throw new Error("Wallet not connected properly.");
      if (!participant.reference) throw new Error("Participant reference is missing.");

      const sig = await payWithConnectedWalletSDK({
        conn: await createConnection(),
        signer: provider,
        payer: accounts[0],
        recipient: pact.receiverWallet,
        amount: pact.amountPerPerson,
        reference: participant.reference,
        splToken: pact.splToken,
      });

      await markParticipantPaid(pact.id, participantIndex, sig);
      setPaymentStatus('success');

      // 3. REPLACE setTimeout logic with a REDIRECT
      setTimeout(() => {
        if (pactId) {
            navigate(`/pact/${pactId}`);
        }
      }, 2500);

    } catch (e: any) {
      alert(e?.message || "Payment failed");
      setPaymentStatus('idle'); // Reset to idle on failure to allow retry
    }
  };

  const handlePinSubmit = async (pin: string) => {
    setIsPinLoading(true);
    setPinError(null);
    try {
      if (pinMode === 'set') {
        await setPin(pin);
        setUserHasPin(true);
      } else {
        const isValid = await verifyPin(pin);
        if (!isValid) throw new Error("Invalid PIN. Please try again.");
      }
      await executePayment();
    } catch (e: any) {
      setPinError(e.message || "An unknown error occurred.");
    } finally {
      setIsPinLoading(false);
    }
  };

  const handlePayWithWalletClick = () => {
    if (userHasPin === null) {
      alert("Verifying security settings, please wait...");
      return;
    }
    setPinMode(userHasPin ? 'enter' : 'set');
    setPinError(null);
    setIsPinModalOpen(true);
  };
  
  if (paymentStatus === 'success') return <SuccessAnimation />;
  if (paymentStatus === 'processing') return <LoadingOverlay message="Confirming transaction..." />;
  if (loading) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">Loading Payment Details...</div>;
  if (err) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-red-500 p-6">{err}</div>;
  if (!pact || !participant) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-red-500 p-6">Participant not found in this pact.</div>;

  if (participant.paid) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white p-6">
        <div className="relative z-10 max-w-md w-full mx-auto p-8 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg text-center">
            <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-400">Payment Complete</h2>
            <p className="text-gray-400 mt-2">This payment has already been made. Thank you!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UpiPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSubmit={handlePinSubmit}
        mode={pinMode}
        isLoading={isPinLoading}
        error={pinError}
      />
      <div className="relative min-h-screen bg-[#09090B] text-white flex items-center justify-center p-4 pt-24">
        <div className="relative z-10 max-w-md w-full mx-auto p-6 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-semibold mb-2">Payment for {pact.name}</h2>
          <p className="text-gray-400 mb-6">You are required to pay the amount below.</p>
          
          <div className="space-y-2 mb-8">
            <DetailItem 
                icon={pact.splToken ? <FaCoins/> : <FaSolarPanel />} 
                label="Amount" 
                value={`${pact.amountPerPerson} ${pact.splToken ? 'Token' : 'SOL'}`} 
            />
            <DetailItem 
                icon={<FaWallet/>} 
                label="To" 
                value={`${pact.receiverWallet.substring(0, 4)}...${pact.receiverWallet.substring(pact.receiverWallet.length - 4)}`}
            />
            <DetailItem 
                icon={<FaCalendarAlt/>} 
                label="Due Date" 
                value={new Date(pact.dueDate).toLocaleDateString()}
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <PaymentQR url={payUrl} />
            </div>
            <div className="text-sm text-gray-500">
              Scan with a mobile wallet or use a button below.
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <a
                href={payUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] text-white rounded-md hover:border-purple-500 transition-colors flex items-center justify-center gap-2"
              >
                <FaMoneyBillWave /> Open in External Wallet
              </a>
              {connected && (
                <button
                  onClick={handlePayWithWalletClick}
                  disabled={userHasPin === null}
                  className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Pay with Embedded Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}