import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana"; // real wallet hook
import { ensureFirebaseAuth } from "../lib/firebase"; // real firebase auth
import { createPact } from "../lib/pacts"; // real backend pact creation
import { useNavigate } from "react-router-dom";

export default function CreatePact() {
  const { accounts } = useSolanaWallet();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [due, setDue] = useState("");
  const [participantsText, setParticipantsText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  const parseParticipants = () => {
    const items = participantsText
      .split(/\n|,|\s/)
      .map((s) => s.trim())
      .filter(Boolean);

    return items.map((v) => (v.includes("@") ? { email: v } : { wallet: v }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !amount || !receiver || !due) {
      setError("Please fill all required fields.");
      return;
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const participants = parseParticipants();
    if (participants.length === 0) {
      setError("Add at least one participant (email or wallet).");
      return;
    }

    setSubmitting(true);
    try {
      const pactData = {
        name,
        amountPerPerson: amountNum,
        receiverWallet: receiver,
        dueDate: new Date(due).toISOString(),
        createdBy: accounts?.[0],
        participants,
      };

      // ✅ Use real createPact, returns real pactId like IirSK6wOEdWIS6s6kvWS
      const pactId = await createPact(pactData);

      // ✅ Send pact email invite with correct pactId
      await fetch("http://localhost:3001/send-pact-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pactData, pactId }),
      });

      setSuccess(`Pact created successfully! Participants are being notified.`);

      // ✅ Navigate to the new pact page
      navigate(`/pact/${pactId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create pact or send emails.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-24">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto p-6 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Create a New Pact
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-300 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Pact Name
            </label>
            <input
              className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., August Rent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Amount per Person
              </label>
              <input
                type="text"
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 5.0001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Receiver Wallet
              </label>
              <input
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Receiver public key"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Participants (emails or wallets)
            </label>
            <textarea
              className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f48de]"
              rows={5}
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              placeholder="one per line (email or wallet)\nor comma/space separated"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full font-semibold py-3 rounded-md transition-colors ${
              submitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7f48de] hover:bg-[#7437DC]"
            } text-white`}
          >
            {submitting ? "Creating..." : "Create Pact"}
          </button>
        </form>
      </div>
    </div>
  );
}