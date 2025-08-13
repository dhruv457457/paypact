// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const { userInfo } = useWeb3Auth();
  const { accounts } = useSolanaWallet();
  const [firestoreUser, setFirestoreUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirestoreUser = async () => {
      if (accounts && accounts.length > 0) {
        const userRef = doc(db, "users", accounts[0]);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFirestoreUser(userSnap.data());
        }
        setLoading(false);
      }
    };
    fetchFirestoreUser();
  }, [accounts]);

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">User Profile</h2>
      {userInfo && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={userInfo.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold">{userInfo.name}</h3>
              <p className="text-gray-600">{userInfo.email}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Wallet Address:</h4>
            <p className="font-mono text-sm text-gray-700 break-all">
              {accounts && accounts.length > 0 ? accounts[0] : "Not available"}
            </p>
          </div>
          {firestoreUser && (
            <div>
              <h4 className="font-semibold">Login Method:</h4>
              <p className="text-gray-700">{firestoreUser.authMethod}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}