// src/components/Balance.tsx
import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export function Balance() {
  const { accounts, connection } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connection || !accounts || accounts.length === 0) return;

    connection.getBalance(new PublicKey(accounts[0])).then((lamports) => {
      setBalance(lamports / LAMPORTS_PER_SOL);
    });
  }, [connection, accounts]);

  return (
    <div>
      <h2>SOL Balance</h2>
      <p>{balance !== null ? `${balance.toFixed(4)} SOL` : "No balance"}</p>
    </div>
  );
}
