import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../lib/firebase";
import { createPact } from "../lib/pacts";
import { useNavigate } from "react-router-dom";
import { getContacts } from "../lib/contacts";
import { FaUserPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Contact = {
  name: string;
  email: string;
  publicKey: string;
};

export default function CreatePact() {
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";

  // State for form inputs
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [due, setDue] = useState("");
  const [participantsText, setParticipantsText] = useState("");

  // State for UI/UX
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for contacts
  const [savedContacts, setSavedContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    // Fetch contacts when the component mounts and wallet is ready
    const fetchContacts = async () => {
      if (wallet) {
        try {
          const contactsData = await getContacts();
          setSavedContacts(Object.values(contactsData));
        } catch (err) {
          console.error("Failed to fetch contacts:", err);
        }
      }
    };
    fetchContacts();
  }, [wallet]);

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

      const pactId = await createPact(pactData);

      await fetch("http://localhost:3001/send-pact-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pactData, pactId }),
      });

      setSuccess(`Pact created successfully! Participants are being notified.`);

      navigate(`/pact/${pactId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create pact or send emails.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFromContacts = () => {
    // Collect all public keys and emails from selected contacts
    const newParticipants = selectedContacts.map((contact) =>
      contact.email || contact.publicKey
    );

    // Append to existing participants, separated by a newline
    setParticipantsText(
      (prev) => `${prev.trim()}\n${newParticipants.join("\n")}`.trim()
    );

    // Close the modal and reset selections
    setShowContactModal(false);
    setSelectedContacts([]);
  };

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.publicKey === contact.publicKey)
        ? prev.filter((c) => c.publicKey !== contact.publicKey)
        : [...prev, contact]
    );
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-24">
      <div className="relative z-10 max-w-2xl mx-auto p-6 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Create a New Pact
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-300 p-3 rounded-md mb-4">
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">
                Participants (emails or wallets)
              </label>
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 transition-colors py-1 px-2 rounded-md"
              >
                <FaUserPlus /> Add from Contacts
              </button>
            </div>
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

      {/* Contacts Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg w-full max-w-xl p-6 relative">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Select Participants from Contacts
            </h3>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {savedContacts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  You have no saved contacts.
                </div>
              ) : (
                savedContacts.map((contact) => (
                  <div
                    key={contact.publicKey}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                      selectedContacts.some(
                        (c) => c.publicKey === contact.publicKey
                      )
                        ? "bg-[#7f48de] bg-opacity-20 border border-[#7f48de]"
                        : "bg-[#1C1C1E] hover:bg-[#2C2C2F]"
                    }`}
                    onClick={() => toggleContactSelection(contact)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {contact.email || contact.publicKey}
                      </div>
                    </div>
                    {selectedContacts.some(
                      (c) => c.publicKey === contact.publicKey
                    ) ? (
                      <FaCheckCircle className="text-[#7f48de] ml-2" />
                    ) : null}
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFromContacts}
                disabled={selectedContacts.length === 0}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                  selectedContacts.length === 0
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-[#7f48de] hover:bg-[#7437DC] text-white"
                }`}
              >
                Add Selected ({selectedContacts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
