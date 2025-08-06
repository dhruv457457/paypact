import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";

export default function SendTransaction() {
  const { sendTransaction, data: txnHash, isLoading, error } = useSendTransaction();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: txnHash });
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    await sendTransaction({ to, value: parseEther(value) });
  }

  return (
    <div>
      <h2>Send Transaction</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Recipient" value={to} onChange={e => setTo(e.target.value)} />
        <input placeholder="ETH" type="number" step="0.0001" value={value} onChange={e => setValue(e.target.value)} />
        <button disabled={isLoading}>{isLoading ? "Sending…" : "Send"}</button>
      </form>
      {txnHash && <p>Hash: {txnHash}</p>}
      {confirming && <p>Confirming…</p>}
      {isSuccess && <p>Confirmed!</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
