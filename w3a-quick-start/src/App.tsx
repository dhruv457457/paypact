import React, { useEffect, useState } from "react";
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export default function MinimalTest() {
  const { connect, isConnected, connectorName, loading, error: loginError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnecting, error: logoutError } = useWeb3AuthDisconnect();
  const { accounts, connection, error: solanaError } = useSolanaWallet();

  // SOL Balance state
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const addressAvailable = accounts && accounts.length > 0;

  const fetchBalance = async () => {
    if (connection && addressAvailable) {
      try {
        setLoadingBalance(true);
        setBalanceError(null);
        const lamports = await connection.getBalance(new PublicKey(accounts[0]));
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (err) {
        setBalanceError((err as Error).message || "Unknown error fetching balance");
        setBalance(null);
      } finally {
        setLoadingBalance(false);
      }
    } else {
      setBalance(null);
    }
  };

  useEffect(() => {
    fetchBalance();
    // Only re-run when the account or connection changes
    // eslint-disable-next-line
  }, [connection, accounts]);

  return (
    <div style={{
      maxWidth: 400,
      padding: 24,
      margin: "24px auto",
      border: "1px solid #e5e5e5",
      borderRadius: 12,
      background: "#fafbfc",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      <h2>Web3Auth Solana Wallet Test</h2>

      {!isConnected && (
        <button
          onClick={connect}
          disabled={loading}
          style={{
            padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer"
          }}
        >
          {loading ? "Connecting..." : "Login with Web3Auth"}
        </button>
      )}
      {isConnected && (
        <button
          onClick={disconnect}
          disabled={disconnecting}
          style={{
            padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer", background: "#fee", color: "#b00", marginBottom: 10, marginTop: 4
          }}
        >
          {disconnecting ? "Logging out..." : "Log Out"}
        </button>
      )}
      <div style={{ marginTop: 18 }}>
        <div>
          <strong>Status:</strong>{" "}
          <span style={{ color: isConnected ? "green" : "#b37700" }}>
            {isConnected ? `Connected (${connectorName ?? "Web3Auth"})` : "Not Connected"}
          </span>
        </div>
        <div>
          <strong>Address:</strong>{" "}
          {addressAvailable ? (
            <>
              <code style={{
                background: "#eef2fa", padding: "2px 6px", borderRadius: 5
              }}>
                {accounts![0].slice(0, 6)}...{accounts![0].slice(-6)}
              </code>
              <button
                style={{
                  marginLeft: 8, fontSize: 11, padding: "2px 8px", cursor: "pointer"
                }}
                onClick={() => copyToClipboard(accounts![0])}
              >
                Copy
              </button>
            </>
          ) : (
            <i style={{ color: "#888" }}>No address found</i>
          )}
        </div>
        <div>
          <strong>Balance:</strong>{" "}
          {loadingBalance
            ? "Loading..."
            : balance !== null
            ? `${balance.toFixed(4)} SOL`
            : balanceError
            ? `Error: ${balanceError}`
            : "--"}
          {addressAvailable && (
            <button
              onClick={fetchBalance}
              style={{
                marginLeft: 8, fontSize: 11, padding: "2px 8px", cursor: "pointer"
              }}
            >
              Refresh
            </button>
          )}
        </div>
        {solanaError && (
          <div style={{ color: "red", marginTop: 8 }}>
            Solana Hook Error: {solanaError.message}
          </div>
        )}
        {loginError && (
          <div style={{ color: "red", marginTop: 8 }}>
            Login Error: {loginError.message}
          </div>
        )}
        {logoutError && (
          <div style={{ color: "red", marginTop: 8 }}>
            Logout Error: {logoutError.message}
          </div>
        )}
        <div style={{
          marginTop: 18,
          background: "#f6f8fa",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 13,
        }}>
          <strong>Debug:</strong>
          <pre style={{ margin: 0 }}>isConnected: {String(isConnected)}</pre>
          <pre style={{ margin: 0 }}>accounts: {JSON.stringify(accounts)}</pre>
          <pre style={{ margin: 0 }}>solanaError: {solanaError?.message ?? "none"}</pre>
        </div>
      </div>
      <p style={{ fontSize: 13, marginTop: 14, color: "#697484" }}>
        Use social/email login, and your Solana address and balance will appear if login is successful and properly configured. No Phantom/MetaMask needed!
      </p>
    </div>
  );
}
