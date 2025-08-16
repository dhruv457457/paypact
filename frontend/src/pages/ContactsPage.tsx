import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../lib/firebase";
import { getContacts, addContact, deleteContact } from "../lib/contacts";

const ContactsPage = () => {
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";

  const [contacts, setContacts] = useState<{ [key: string]: { name: string; email: string; publicKey: string } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState("");

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

  if (!wallet) {
    return <div className="p-6 text-center text-gray-500">Please connect your wallet to manage contacts.</div>;
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading contacts...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Contact Book</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Add New Contact Form */}
      <form onSubmit={handleAddContact} className="space-y-4 mb-8 p-4 border rounded-lg">
        <h3 className="font-medium text-lg">Add New Contact</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g., John Doe)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (e.g., john.doe@example.com)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          placeholder="Public Key (e.g., 9gHR9...)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Add Contact
        </button>
      </form>

      {/* Existing Contacts List */}
      <h3 className="font-medium text-lg mb-4">My Contacts ({Object.keys(contacts).length})</h3>
      {Object.keys(contacts).length === 0 ? (
        <div className="text-gray-500">You have no contacts yet.</div>
      ) : (
        <div className="space-y-3">
          {Object.values(contacts).map((contact) => (
            <div key={contact.name} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.email}</div>
                <div className="text-sm text-gray-600 font-mono break-all">{contact.publicKey}</div>
              </div>
              <button
                onClick={() => handleDeleteContact(contact.name)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsPage;