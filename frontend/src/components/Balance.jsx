import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export default function Balance() {
  const { address } = useAccount();
  const { data, isLoading, error } = useBalance({ address });

  if (error) return <p>Error: {error.message}</p>;
  if (isLoading) return <p>Loading balance…</p>;
  return <p>Balance: {data ? `${formatUnits(data.value, data.decimals)} ${data.symbol}` : "—"}</p>;
}
