import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { initWeb3Auth, web3auth } from "./lib/web3auth.js";

// 🔎 Debug: Log all Vite env variables immediately (shows in browser console)
console.log("VITE_WEB3AUTH_CLIENT_ID:", import.meta.env.VITE_WEB3AUTH_CLIENT_ID);
console.log("VITE_SOLANA_RPC_URL:", import.meta.env.VITE_SOLANA_RPC_URL);
console.log("VITE_ETHEREUM_RPC_URL:", import.meta.env.VITE_ETHEREUM_RPC_URL);
console.log("All import.meta.env:", import.meta.env);

function App() {
  const { address } = useAccount();
  const [web3authReady, setWeb3authReady] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize Web3Auth on mount
  useEffect(() => {
    (async () => {
      const ok = await initWeb3Auth();
      setWeb3authReady(ok);
    })();
  }, []);

  const handleLogin = async () => {
    if (!web3authReady) return alert("Web3Auth not ready");
    setLoading(true);
    try {
      const provider = await web3auth.connect();
      if (provider && web3auth.connected) {
        const u = await web3auth.getUserInfo();
        setUser(u);
      }
    } catch (e) {
      console.error(e);
      alert(`Login failed: ${e.message}`);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await web3auth.logout();
    setUser(null);
  };

  if (!web3authReady) return <p>Loading authentication...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Cross-Chain DeFi Hub</h1>
      {!user ? (
        <button
          onClick={handleLogin}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded"
        >
          {loading ? "Connecting…" : "Login with Social"}
        </button>
      ) : (
        <div>
          <p>Welcome, {user.name || user.email}</p>
          <p>Your embedded wallet address: {address}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
