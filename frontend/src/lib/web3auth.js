import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;

console.log("🔑 Web3Auth Client ID:", clientId);
console.log("🔑 Environment variable check:", import.meta.env.VITE_WEB3AUTH_CLIENT_ID ? "✅ Found" : "❌ Missing");

// Step 1: Create the private key provider
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3", // Solana Devnet
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig }
});

// Step 2: Create Web3Auth instance with provider
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName: "Cross-Chain DeFi Hub",
    mode: "light",
    logoLight: "https://images.web3auth.io/web3auth-logo.svg",
    logoDark: "https://images.web3auth.io/web3auth-logo.svg",
    defaultLanguage: "en",
    loginMethodsOrder: ["google", "twitter", "email_passwordless"],
    theme: {
      primary: "#7C3AED",
    },
  },
});

let isInitialized = false;

export const initWeb3Auth = async () => {
  if (isInitialized) return true;
  
  try {
    console.log("🔄 Initializing Web3Auth with Solana provider...");
    
    await web3auth.init();
    
    isInitialized = true;
    console.log("✅ Web3Auth initialized successfully!");
    
    if (web3auth.connected) {
      console.log("🔗 User is already connected");
    }
    
    return true;
  } catch (error) {
    console.error("❌ Web3Auth initialization failed:", error);
    console.error("Error details:", error.message);
    return false;
  }
};

export const isWeb3AuthReady = () => isInitialized;
