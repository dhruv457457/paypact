import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../lib/firebase";
import { getContacts, addContact, deleteContact } from "../lib/contacts";
import { FaPlusCircle, FaTrashAlt, FaUserPlus } from "react-icons/fa";

const ContactsPage = () => {
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";

  const [contacts, setContacts] = useState<{ [key: string]: { name: string; email: string; publicKey: string } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await ensureFirebaseAuth();
        if (wallet) {
          const fetchedContacts = await getContacts();
          setContacts(fetchedContacts);
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Failed to fetch contacts.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !publicKey) {
      setError("Name, email, and public key are required.");
      return;
    }
    setError(null);
    try {
      await addContact(name, email, publicKey);
      setContacts((prev) => ({ ...prev, [name]: { name, email, publicKey } }));
      setName("");
      setEmail("");
      setPublicKey("");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to add contact.");
      }
    }
  };

  const handleDeleteContact = async (nameToDelete: string) => {
    try {
      await deleteContact(nameToDelete);
      setContacts((prev) => {
        const { [nameToDelete]: _, ...newContacts } = prev;
        return newContacts;
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to delete contact.");
      }
    }
  };

  const filteredContacts = Object.values(contacts).filter(contact => {
    const query = searchQuery.toLowerCase();
    const contactName = contact.name ? contact.name.toLowerCase() : '';
    const contactEmail = contact.email ? contact.email.toLowerCase() : '';
    const contactPublicKey = contact.publicKey ? contact.publicKey.toLowerCase() : '';

    return (
      contactName.includes(query) ||
      contactEmail.includes(query) ||
      contactPublicKey.includes(query)
    );
  });

  if (!wallet) {
    return (
      <div className="relative min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <p className="p-6 text-center text-gray-500">
          Please connect your wallet to manage contacts.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <p className="p-6 text-center text-gray-500">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-14">
      <div className="relative z-10 mx-auto py-10 px-40 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white">Contact Book</h2>
            <p className="text-gray-400 mt-1">
              Manage your saved contacts for easy group payments.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-red-400 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Add New Contact Form */}
        <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="font-medium text-lg text-white flex items-center gap-2">
            <FaUserPlus /> Add New Contact
          </h3>
          <form onSubmit={handleAddContact} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (e.g., John Doe)"
              className="w-full bg-[#1C1C1E] text-white border border-[#2C2C2F] rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-[#7f48de] transition-colors"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (e.g., john.doe@example.com)"
              className="w-full bg-[#1C1C1E] text-white border border-[#2C2C2F] rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-[#7f48de] transition-colors"
              required
            />
            <input
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="Public Key (e.g., 9gHR9...)"
              className="w-full bg-[#1C1C1E] text-white border border-[#2C2C2F] rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-[#7f48de] transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#7f48de] hover:bg-[#7437DC] text-white font-semibold py-2 rounded-md transition-colors"
            >
              Add Contact
            </button>
          </form>
        </div>

        {/* Existing Contacts List */}
        <h3 className="font-medium text-lg mb-4 text-white">
          My Contacts ({filteredContacts.length})
        </h3>
        
        {/* Search Bar */}
        {Object.keys(contacts).length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-[#1C1C1E] text-white border border-[#2C2C2F] rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-[#7f48de] transition-colors"
            />
          </div>
        )}

        {Object.keys(contacts).length === 0 ? (
          <div className="text-center border-2 border-dashed border-[#1C1C1E] rounded-xl p-12">
            <h3 className="text-xl font-semibold text-white">
              You haven't saved any contacts yet.
            </h3>
            <p className="text-gray-500 mt-2">
              Add a contact to easily select them when creating a new pact.
            </p>
          </div>
        ) : filteredContacts.length === 0 && searchQuery ? (
          <div className="text-center text-gray-500 py-12">
            No contacts found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.name}
                className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg p-5 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-white truncate">
                      {contact.name}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {contact.email}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteContact(contact.name)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    aria-label={`Delete ${contact.name}`}
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 font-mono break-all bg-[#1C1C1E] p-2 rounded-md">
                  {contact.publicKey}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;