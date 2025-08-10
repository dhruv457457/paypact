import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const RPC = import.meta.env.VITE_RPC as string;
const CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID as string;

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: CLIENT_ID,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.SOLANA,
      chainId: "0x3", // devnet
      rpcTarget: RPC,
      displayName: "Solana Devnet",
      blockExplorerUrl: "https://explorer.solana.com?cluster=devnet",
      ticker: "SOL",
      tickerName: "Solana",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
  modalConfig: {
    openlogin: { label: "email", showOnModal: true },
  },
} as any;

export default web3AuthContextConfig;
