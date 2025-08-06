import { useChainId, useSwitchChain } from "wagmi";

export default function SwitchChain() {
  const chainId = useChainId();
  const { chains, switchChain, error } = useSwitchChain();

  return (
    <div>
      <h2>Switch Chain</h2>
      <p>Current Chain ID: {chainId}</p>
      {chains.map(c => (
        <button key={c.id} disabled={chainId === c.id} onClick={() => switchChain({ chainId: c.id })}>
          {c.name}
        </button>
      ))}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
