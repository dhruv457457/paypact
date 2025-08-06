import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import App from "./App.jsx";

// Configure wagmi
const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <App />
  </WagmiProvider>
);
