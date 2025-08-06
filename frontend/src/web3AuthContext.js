import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
console.log("WEB3AUTH_CLIENT_ID", clientId);

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,     // for Ethereum
      chainId: "0x5",                              // Sepolia
      rpcTarget: import.meta.env.VITE_ETHEREUM_RPC_URL,
    },
    solanaChainConfig: {
      chainNamespace: CHAIN_NAMESPACES.SOLANA,     // for Solana
      chainId: "0x3",                              // Devnet
      rpcTarget: import.meta.env.VITE_SOLANA_RPC_URL,
    }
  },
};
