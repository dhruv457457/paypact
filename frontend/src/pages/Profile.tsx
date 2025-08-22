import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useWeb3Auth, useWeb3AuthConnect } from "@web3auth/modal/react";
import {
  useSolanaWallet,
  useSignAndSendTransaction,
} from "@web3auth/modal/react/solana";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { listPactsByCreator, listPactsForWallet } from "../lib/pacts";
import {
  FaWallet,
  FaPlusSquare,
  FaUsers,
  FaSyncAlt,
  FaUser,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaSync,
  FaCoins,
} from "react-icons/fa";
import PaymentQR from "../components/PaymentQR";
import MyPacts from "./MyPacts";
import ContactsPage from "./ContactsPage";
import UpiPinModal from "../components/UpiPinModal";
import { checkPinExists, verifyPin, setPin } from "../lib/user";
import { SiSolana } from "react-icons/si";

// USDC token address (Devnet) - You might want to move this to a config file
const USDC_MINT_ADDRESS = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);
const USDC_DECIMALS = 6;

const StatCard = ({
  icon,
  title,
  value,
  isLoading,
  isVisible,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  isLoading: boolean;
  isVisible: boolean;
}) => (
  <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-4 flex flex-col justify-between">
    <div className="flex justify-between items-center text-gray-400">
      <span className="text-sm font-medium">{title}</span>
      {icon}
    </div>
    <div>
      {isLoading ? (
        <div className="h-8 bg-gray-700 rounded-md animate-pulse mt-2"></div>
      ) : (
        <p className="text-2xl font-semibold text-white mt-2">
          {isVisible ? value : "**"}
        </p>
      )}
    </div>
  </div>
);

export default function Profile() {
  const { status } = useWeb3Auth();
  const {
    connect,
    isConnected,
    loading: connectLoading,
    connectorName,
  } = useWeb3AuthConnect();
  const { accounts, connection } = useSolanaWallet();
  const {
    signAndSendTransaction,
    loading: txLoading,
    error: txError,
    data: txSignature,
  } = useSignAndSendTransaction();

  // Balances State
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Pact States
  const [organizerPacts, setOrganizerPacts] = useState<any[]>([]);
  const [participantPacts, setParticipantPacts] = useState<any[]>([]);
  const [loadingPacts, setLoadingPacts] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState("My Wallet");
  const [copied, setCopied] = useState(false);
  const [statsVisible, setStatsVisible] = useState(() => {
    const saved = localStorage.getItem("statsVisible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // PIN States
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [userHasPin, setUserHasPin] = useState<boolean | null>(null);
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
  const [changePinStep, setChangePinStep] = useState<"verify" | "set">(
    "verify"
  );
  const [changePinError, setChangePinError] = useState<string | null>(null);

  // Transaction States
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSendingUsdc, setIsSendingUsdc] = useState(false);

  const addressAvailable = accounts && accounts.length > 0;
  const walletAddress = addressAvailable ? accounts[0] : null;

  useEffect(() => {
    localStorage.setItem("statsVisible", JSON.stringify(statsVisible));
  }, [statsVisible]);

  const checkForPin = async () => {
    if (isConnected && userHasPin === null) {
      try {
        const hasPin = await checkPinExists();
        setUserHasPin(hasPin);
        setChangePinStep(hasPin ? "verify" : "set");
      } catch (error) {
        console.error("Failed to check for PIN:", error);
        setUserHasPin(false);
      }
    }
  };

  useEffect(() => {
    checkForPin();
  }, [isConnected, userHasPin]);

  const handleToggleStatsVisibility = () => {
    if (statsVisible) {
      setStatsVisible(false);
    } else {
      if (userHasPin) {
        setPinError(null);
        setIsPinModalOpen(true);
      } else {
        setStatsVisible(true);
      }
    }
  };

  const handlePinSubmit = async (pin: string) => {
    setIsPinLoading(true);
    setPinError(null);
    try {
      const isValid = await verifyPin(pin);
      if (!isValid) throw new Error("Invalid PIN. Please try again.");
      setStatsVisible(true);
      setIsPinModalOpen(false);
    } catch (e: any) {
      setPinError(e.message || "An unknown error occurred.");
    } finally {
      setIsPinLoading(false);
    }
  };

  const handleChangePinSubmit = async (pin: string) => {
    setIsPinLoading(true);
    setChangePinError(null);
    try {
      if (userHasPin && changePinStep === "verify") {
        const isValid = await verifyPin(pin);
        if (!isValid) throw new Error("Old PIN is incorrect.");
        setChangePinStep("set");
      } else {
        await setPin(pin);
        setUserHasPin(true);
        setIsChangePinModalOpen(false);
        alert("PIN updated successfully!");
      }
    } catch (e: any) {
      setChangePinError(e.message);
    } finally {
      setIsPinLoading(false);
    }
  };

  const fetchBalance = async () => {
    setBalanceError(null);
    if (connection && addressAvailable) {
      try {
        setLoadingBalance(true);
        const ownerPublicKey = new PublicKey(accounts[0]);
        const solLamports = await connection.getBalance(ownerPublicKey);
        setSolBalance(solLamports / LAMPORTS_PER_SOL);
        try {
          const usdcTokenAccount = await getAssociatedTokenAddress(
            USDC_MINT_ADDRESS,
            ownerPublicKey
          );
          const usdcAccountInfo = await connection.getTokenAccountBalance(
            usdcTokenAccount
          );
          setUsdcBalance(usdcAccountInfo.value.uiAmount);
        } catch (e) {
          setUsdcBalance(0);
        }
      } catch (err: any) {
        setBalanceError(err?.message || "Balance fetch error");
      } finally {
        setLoadingBalance(false);
      }
    }
  };

  const fetchPacts = async () => {
    if (walletAddress) {
      setLoadingPacts(true);
      try {
        const [organized, participating] = await Promise.all([
          listPactsByCreator(walletAddress),
          listPactsForWallet(walletAddress),
        ]);
        setOrganizerPacts(organized);
        setParticipantPacts(participating);
      } catch (error) {
        console.error("Failed to fetch pacts:", error);
      } finally {
        setLoadingPacts(false);
      }
    }
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBalance();
      fetchPacts();
    }
  }, [connection, accounts, isConnected]);

  const {
    pactsOrganized,
    pactsJoined,
    totalVolumePaid,
    activityFeed,
    allPacts,
  } = useMemo(() => {
    let volumePaid = 0;
    let feed: any[] = [];
    participantPacts.forEach((pact) => {
      const myParticipantInfo = pact.participants.find(
        (p: any) => p.wallet === walletAddress
      );
      if (myParticipantInfo && myParticipantInfo.paid) {
        volumePaid += pact.amountPerPerson;
        feed.push({
          type: "Paid Pact",
          name: pact.name,
          date: myParticipantInfo.paidAt || pact.createdAt?.toDate(),
          amount: pact.amountPerPerson,
          status: "Completed",
        });
      }
    });
    organizerPacts.forEach((pact) => {
      feed.push({
        type: "Created Pact",
        name: pact.name,
        date: pact.createdAt?.toDate(),
        status: "Created",
      });
    });
    feed.sort((a, b) => (b.date || 0) - (a.date || 0));
    const combinedPacts = [...organizerPacts];
    participantPacts.forEach((pact) => {
      if (!combinedPacts.find((op) => op.id === pact.id)) {
        combinedPacts.push(pact);
      }
    });
    return {
      pactsOrganized: organizerPacts.length,
      pactsJoined: participantPacts.length,
      totalVolumePaid: volumePaid.toFixed(4),
      activityFeed: feed,
      allPacts: combinedPacts,
    };
  }, [organizerPacts, participantPacts, walletAddress]);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressAvailable || !connection) return;
    try {
      const fromPubkey = new PublicKey(accounts[0]);
      const toPubkey = new PublicKey(toAddress);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      const tx = new Transaction({
        blockhash,
        lastValidBlockHeight,
        feePayer: fromPubkey,
      });
      if (isSendingUsdc) {
        const fromTokenAccount = await getAssociatedTokenAddress(
          USDC_MINT_ADDRESS,
          fromPubkey
        );
        const toTokenAccount = await getAssociatedTokenAddress(
          USDC_MINT_ADDRESS,
          toPubkey
        );
        tx.add(
          createTransferCheckedInstruction(
            fromTokenAccount,
            USDC_MINT_ADDRESS,
            toTokenAccount,
            fromPubkey,
            Number(amount) * Math.pow(10, USDC_DECIMALS),
            USDC_DECIMALS
          )
        );
      } else {
        tx.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: Math.round(Number(amount) * LAMPORTS_PER_SOL),
          })
        );
      }
      await signAndSendTransaction(tx);
      await fetchBalance();
      setToAddress("");
      setAmount("");
    } catch (err) {
      console.error("Transaction send error:", err);
    }
  };

  if (status === "not_ready" || status === "connecting")
    return (
      <div className="relative min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center">
        <p className="text-gray-400">Initializing Wallet...</p>
      </div>
    );
  if (!isConnected)
    return (
      <div className="relative min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold mb-4">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-400 mb-8">
          Connect your wallet to view your activity and manage your pacts.
        </p>
        <button
          onClick={() => connect()}
          disabled={connectLoading}
          className="font-semibold py-3 px-8 rounded-md transition-colors bg-[#7f48de] hover:bg-[#7437DC] disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {connectLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-14">
      <UpiPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSubmit={handlePinSubmit}
        mode={"enter"}
        isLoading={isPinLoading}
        error={pinError}
      />
      <UpiPinModal
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
        onSubmit={handleChangePinSubmit}
        mode={changePinStep === "set" ? "set" : "enter"}
        isLoading={isPinLoading}
        error={changePinError}
      />

      <div className="relative z-10 lg:px-40 mx-auto p-6 space-y-8 border-t border-[#1C1C1E]">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
            <p className="text-gray-400 mt-1">
              Welcome back, here is your overview.
            </p>
          </div>
          <button
            onClick={handleToggleStatsVisibility}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            {statsVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<FaWallet />}
            title="Wallet Balance"
            value={`${solBalance !== null ? solBalance.toFixed(4) : "--"} SOL`}
            isLoading={loadingBalance}
            isVisible={statsVisible}
          />
          <StatCard
            icon={<FaPlusSquare />}
            title="Pacts Organized"
            value={pactsOrganized}
            isLoading={loadingPacts}
            isVisible={statsVisible}
          />
          <StatCard
            icon={<FaUsers />}
            title="Pacts Joined"
            value={pactsJoined}
            isLoading={loadingPacts}
            isVisible={statsVisible}
          />
          <StatCard
            icon={<FaSyncAlt />}
            title="Total Volume Paid"
            value={`${totalVolumePaid} SOL`}
            isLoading={loadingPacts}
            isVisible={statsVisible}
          />
        </div>

        <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-2 flex flex-wrap sm:flex-nowrap gap-2">
          {["My Wallet", "All Pacts", "My Pacts", "Contacts", "Activity"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#1C1C1E] text-white"
                    : "text-gray-400 hover:bg-[#151517] hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-6 min-h-[300px]">
          {activeTab === "Activity" && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Activity Feed
              </h3>
              <div className="space-y-4">
                {activityFeed.length > 0 ? (
                  activityFeed.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {item.type}:{" "}
                          <span className="text-gray-300">{item.name}</span>
                        </p>
                        <p className="text-gray-500">
                          {item.date
                            ? new Date(item.date).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        {item.amount && (
                          <p
                            className={`font-mono ${
                              item.type === "Paid Pact"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {statsVisible
                              ? `${
                                  item.type === "Paid Pact" ? "+" : "-"
                                }${item.amount.toFixed(4)} SOL`
                              : "**"}
                          </p>
                        )}
                        <p
                          className={`font-medium ${
                            item.status === "Completed"
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No activity yet.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "All Pacts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingPacts ? (
                <p className="text-gray-400 col-span-full text-center">
                  Loading your pacts...
                </p>
              ) : allPacts.length > 0 ? (
                allPacts.map((p: any) => {
                  const paidCount = (p.participants || []).filter(
                    (x: any) => x.paid
                  ).length;
                  const total = (p.participants || []).length;
                  const progress = total > 0 ? (paidCount / total) * 100 : 0;
                  const totalCollected = paidCount * p.amountPerPerson;

                  return (
                    <Link
                      to={`/pact/${p.id}`}
                      key={p.id}
                      className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-white truncate">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          <span className="font-semibold text-green-400">
                            {statsVisible ? `${p.amountPerPerson} SOL` : "**"}
                          </span>{" "}
                          per person
                        </p>
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                            <span>Collection Progress</span>
                            <span>
                              {paidCount} / {total} Paid
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700">
                            <div
                              className="bg-gradient-to-r from-[#7f48de] to-[#7437DC] h-full rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className=" px-5 py-3 border-t border-[#1C1C1E] text-sm flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FaUser />
                          <span>{total} Participants</span>
                        </div>
                        <span className="font-semibold text-green-400">
                          {statsVisible
                            ? `${totalCollected.toFixed(4)} SOL`
                            : "**"}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  You are not part of any pacts yet.
                </p>
              )}
            </div>
          )}
          {activeTab === "My Wallet" && walletAddress && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#151517]/50 border border-[#1C1C1E] rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Wallet Details
                  </h3>
                  <div className="flex justify-center">
                    <div className="p-4 bg-black/20 rounded-xl inline-block">
                      <PaymentQR url={`solana:${walletAddress}`} />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-[#09090B] border border-[#3A3A3C] rounded-md text-sm font-mono text-gray-300 max-w-full break-all">
                    {walletAddress}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#7f48de] hover:bg-[#7437DC] text-white font-semibold rounded-md transition-colors"
                  >
                    <FaCopy /> {copied ? "Copied!" : "Copy Address"}
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#151517]/50 border border-[#1C1C1E] rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Balances
                    </h3>
                    <button
                      onClick={fetchBalance}
                      disabled={loadingBalance}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <FaSync
                        className={loadingBalance ? "animate-spin" : ""}
                      />{" "}
                      Refresh
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <SiSolana className="text-purple-400 text-2xl" />
                        <span className="font-medium text-gray-300">
                          SOL Balance
                        </span>
                      </div>
                      <span className="font-mono text-white">
                        {loadingBalance
                          ? "..."
                          : `${solBalance?.toFixed(4) ?? "0.0000"} SOL`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaCoins className="text-blue-400 text-2xl" />
                        <span className="font-medium text-gray-300">
                          USDC Balance
                        </span>
                      </div>
                      <span className="font-mono text-white">
                        {loadingBalance
                          ? "..."
                          : `${usdcBalance?.toFixed(4) ?? "0.0000"} USDC`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#151517]/50 border border-[#1C1C1E] rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Send Transaction
                  </h3>
                  <form onSubmit={handleSend} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        placeholder="Recipient address"
                        required
                        className="w-full bg-[#0C0C0E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="any"
                        placeholder={`Amount (${
                          isSendingUsdc ? "USDC" : "SOL"
                        })`}
                        required
                        className="w-full bg-[#0C0C0E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        id="send-usdc"
                        checked={isSendingUsdc}
                        onChange={(e) => setIsSendingUsdc(e.target.checked)}
                        className="form-checkbox bg-[#0C0C0E] text-[#7f48de] h-4 w-4 rounded focus:ring-[#7f48de] border-[#3A3A3C]"
                      />
                      <label htmlFor="send-usdc">
                        Send USDC Instead of SOL
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={txLoading}
                      className="w-full font-semibold py-2.5 rounded-md bg-[#7f48de] hover:bg-[#7437DC] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      {" "}
                      {txLoading ? "Sending..." : "Send"}{" "}
                    </button>
                    {txSignature && (
                      <p className="text-xs text-green-400 break-all">
                        ✅ Sent! Sig: {txSignature}
                      </p>
                    )}
                    {txError && (
                      <p className="text-xs text-red-500">{txError.message}</p>
                    )}
                  </form>
                </div>

                <div className="bg-[#151517]/50 border border-[#1C1C1E] rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Security
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Manage your account's security PIN for authorizing
                    transactions.
                  </p>
                  <button
                    onClick={() => {
                      setChangePinError(null);
                      setChangePinStep(userHasPin ? "verify" : "set");
                      setIsChangePinModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                  >
                    <FaKey />{" "}
                    {userHasPin ? "Change Security PIN" : "Set Security PIN"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Contacts" && <ContactsPage />}
          {activeTab === "My Pacts" && <MyPacts />}
        </div>
      </div>
    </div>
  );
}
