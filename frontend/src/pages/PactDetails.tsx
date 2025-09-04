import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaCopy,
  FaExternalLinkAlt,
  FaUserClock,
  FaUserCheck,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";

import { ensureFirebaseAuth } from "../lib/firebase";
import { listenPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL } from "../lib/solanapay";
import { createConnection } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";

import PaymentQR from "../components/PaymentQR";
import UpiPinModal from "../components/UpiPinModal";
import LoadingOverlay from "../components/LoadingOverlay";
import { checkPinExists, setPin, verifyPin } from "../lib/user";

// --- Type Definitions ---
type Participant = {
  email?: string;
  wallet?: string;
  reference?: string;
  paid?: boolean;
  i: number;
  paidTx?: string;
};
type PactDoc = {
  id: string;
  name: string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string;
  createdBy?: string;
  participants: Participant[];
  createdAt?: any;
  splToken?: string;
};

// --- Helper Functions & Components ---
const truncateIdentifier = (identifier: string, length = 8) => {
  if (!identifier) return "";
  if (identifier.length <= length * 2) return identifier;
  return `${identifier.substring(0, length)}...${identifier.substring(
    identifier.length - length
  )}`;
};

const SuccessAnimation = () => (
  <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center z-50">
    <div className="relative">
      <div className="w-24 h-24 bg-green-500/20 rounded-full animate-ping" />
      <div className="absolute inset-0 flex items-center justify-center">
        <FaCheckCircle className="text-5xl text-green-400" />
      </div>
    </div>
    <h2 className="text-2xl font-semibold text-white mt-6">
      Payment Successful!
    </h2>
  </div>
);

const CLUSTER =
  (import.meta.env.VITE_CLUSTER as
    | "mainnet-beta"
    | "devnet"
    | "testnet"
    | undefined) || "mainnet-beta";

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
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"set" | "enter">("enter");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [userHasPin, setUserHasPin] = useState<boolean | null>(null);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  useEffect(() => {
    ensureFirebaseAuth();
    if (!id) return;
    const unsub = listenPact(id, (doc) => {
      if (doc) {
        setPact(doc as PactDoc);
      } else {
        setErr("Pact not found or you don't have access.");
      }
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [id]);

  useEffect(() => {
    const checkForPin = async () => {
      if (connected && userHasPin === null) {
        try {
          const hasPin = await checkPinExists();
          setUserHasPin(hasPin);
          setPinMode(hasPin ? "enter" : "set");
        } catch (error) {
          console.error("Failed to check for PIN:", error);
          setUserHasPin(false);
          setPinMode("set");
        }
      }
    };
    checkForPin();
  }, [connected, userHasPin]);

  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => setPaymentStatus("idle"), 2500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  const { unpaid, paid, progress } = useMemo(() => {
    const participants = (pact?.participants || []).map((p, i) => ({
      ...p,
      i,
    }));
    const paidParticipants = participants.filter((p) => p.paid);
    const progressPercentage = pact?.participants.length
      ? (paidParticipants.length / pact.participants.length) * 100
      : 0;
    return {
      unpaid: participants.filter((p) => !p.paid),
      paid: paidParticipants,
      progress: progressPercentage,
    };
  }, [pact]);

  const executePayment = async () => {
    if (!pact || !selectedParticipant) return;
    setIsPinModalOpen(false);
    setPaymentStatus("processing");

    try {
      if (
        !connected ||
        !provider ||
        typeof (provider as any).request !== "function"
      )
        throw new Error("Wallet not connected properly");
      if (!selectedParticipant.reference)
        throw new Error("Participant reference missing");
      const sig = await payWithConnectedWalletSDK({
        conn: await createConnection(),
        signer: provider,
        payer: accounts![0],
        recipient: pact.receiverWallet,
        amount: pact.amountPerPerson,
        reference: selectedParticipant.reference,
        splToken: pact.splToken,
      });
      await markParticipantPaid(pact.id, selectedParticipant.i, sig);
      setPaymentStatus("success");
    } catch (e: any) {
      alert(e?.message || "Payment failed");
      setPaymentStatus("error");
    }
  };

  const handlePinSubmit = async (pin: string) => {
    setIsPinLoading(true);
    setPinError(null);
    try {
      if (pinMode === "set") {
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

  const handlePayClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    if (userHasPin === null) {
      alert("Please wait, verifying security settings...");
      return;
    }
    setPinMode(userHasPin ? "enter" : "set");
    setPinError(null);
    setIsPinModalOpen(true);
  };

  const hasEmbedded =
    !!provider && typeof (provider as any).request === "function" && connected;
  const isNonMainnet = CLUSTER !== "mainnet-beta";

  if (paymentStatus === "success") return <SuccessAnimation />;
  if (paymentStatus === "processing")
    return <LoadingOverlay message="Confirming transaction..." />;
  if (loading)
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        Loading Pact Details...
      </div>
    );
  if (err)
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-red-500 p-6 text-center">
        <FaExclamationTriangle className="mx-auto text-4xl mb-4" />
        {err}
      </div>
    );
  if (!pact)
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-red-500">
        Pact not found.
      </div>
    );

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

      <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-14 pb-12">
        <div className="relative z-10 mx-auto p-4 sm:px-40 space-y-8 border-t border-[#1C1C1E] ">
          <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-6 space-y-5">
            <h2 className="text-3xl font-bold text-white text-center">
              {pact.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-[#151517]/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                  <SiSolana /> Amount
                </div>
                <p className="font-semibold text-purple-400 text-lg">
                  {pact.amountPerPerson} {pact.splToken ? "Token" : "SOL"}
                </p>
              </div>
              <div className="bg-[#151517]/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                  <FaCalendarAlt /> Due Date
                </div>
                <p className="font-semibold text-white text-lg">
                  {new Date(pact.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-[#151517]/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Receiver</div>
                <p
                  className="font-mono text-white text-lg truncate"
                  title={pact.receiverWallet}
                >
                  {truncateIdentifier(pact.receiverWallet)}
                </p>
              </div>
            </div>

            {pact.splToken && (
              <p className="text-xs text-center text-gray-500 font-mono flex items-center justify-center gap-2">
                <FaInfoCircle /> Token: {truncateIdentifier(pact.splToken, 12)}
              </p>
            )}

            <div>
              <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span>Collection Progress</span>
                <span>
                  {paid.length} / {pact.participants.length} Paid
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 border border-gray-700">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {isNonMainnet && (
            <div className="text-xs bg-[#0C0C0E] border border-[#1C1C1E] p-3 rounded-md flex items-center gap-2">
              {" "}
              <FaExclamationTriangle /> You're on <b>{CLUSTER}</b>. Ensure your
              wallet is also on <b>{CLUSTER}</b>.{" "}
            </div>
          )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* UNPAID SECTION */}
  <div>
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <FaUserClock className="text-yellow-400" /> Unpaid ({unpaid.length})
    </h3>
    <div className="space-y-4">
      {unpaid.map((p) => {
        const who = p.email || p.wallet || `Participant ${p.i + 1}`;
        const url = makePayURL({
          recipient: pact.receiverWallet,
          amount: pact.amountPerPerson,
          reference: p.reference,
          splToken: pact.splToken,
          label: pact.name,
          message: `Payment for ${who}`,
        }).toString();
        return (
          <div
            key={p.i}
            className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 transition-all duration-300 hover:border-purple-500/50"
          >
            <div className="flex-shrink-0">
              <PaymentQR url={url} />
            </div>
            {/* This container is fixed to prevent overflow */}
            <div className="w-full flex flex-col space-y-4 min-w-0">
              {/* Text details */}
              <div>
                <p
                  className="font-semibold text-white text-base truncate"
                  title={who}
                >
                  {who}
                </p>
                <p
                  className="text-gray-500 text-xs font-mono truncate mt-0.5"
                  title={p.reference}
                >
                  Ref: {p.reference ? truncateIdentifier(p.reference) : "-"}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 text-xs px-3 py-2.5 rounded-md bg-[#1C1C1E] border border-[#3A3A3C] hover:bg-[#2a2a2d] transition-colors"
                    onClick={() => navigator.clipboard.writeText(url)}
                  >
                    <FaCopy /> Copy URL
                  </button>
                </div>
                {hasEmbedded && !!p.reference && (
                  <button
                    onClick={() => handlePayClick(p)}
                    className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2.5 rounded-md bg-[#7f48de] cursor-pointer hover:bg-[#7437DC] font-semibold text-white transition-colors"
                    disabled={userHasPin === null}
                  >
                    <FaMoneyBillWave /> Pay with My Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {unpaid.length === 0 && (
        <div className="text-center py-6 bg-[#0C0C0E] border-2 border-dashed border-[#1C1C1E] rounded-xl">
          <FaCheckCircle className="mx-auto text-3xl text-green-500 mb-2" />
          <p className="text-sm font-semibold text-green-400">
            All participants have paid!
          </p>
        </div>
      )}
    </div>
  </div>

  {/* PAID SECTION */}
  <div>
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <FaUserCheck className="text-green-400" /> Paid ({paid.length})
    </h3>
    <div className="space-y-3">
      {paid.map((p) => (
        <div
          key={p.i}
          className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-4 text-sm flex justify-between items-center"
        >
          <div>
            <p
              className="font-semibold text-white truncate"
              title={p.email || p.wallet}
            >
              {truncateIdentifier(
                p.email || p.wallet || `Participant ${p.i + 1}`,
                20
              )}
            </p>
            <p className="text-green-400 text-xs flex items-center gap-1.5 mt-0.5">
              <FaCheckCircle /> Paid
            </p>
          </div>
          {p.paidTx && (
            <a
              href={`https://explorer.solana.com/tx/${p.paidTx}?cluster=${CLUSTER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-purple-400 hover:underline hover:text-purple-300 transition-colors"
            >
              View TX
            </a>
          )}
        </div>
      ))}
      {paid.length === 0 && (
        <div className="text-center py-6 bg-[#0C0C0E] border-2 border-dashed border-[#1C1C1E] rounded-xl">
          <p className="text-sm text-gray-500">
            No payments received yet.
          </p>
        </div>
      )}
    </div>
  </div>
</div>
        </div>
      </div>
    </>
  );
}
