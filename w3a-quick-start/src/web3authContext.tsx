// src/web3authContext.ts
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId = "BHmzQGTLPY_gtt_WnkuK3QHJyl3sgKiYDQdFIzT5xsFrRYHUeVM5PeWq0EvYCp8L-d1RFpIzb0ODjz1fG773xW4"; // Replace with your client ID

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.SOLANA,
      chainId: "0x3", // Devnet
      rpcTarget: "https://api.devnet.solana.com",
      displayName: "Solana Devnet",
      blockExplorer: "https://explorer.solana.com?cluster=devnet",
      ticker: "SOL",
      tickerName: "Solana",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
  modalConfig: {
    openlogin: {
      label: "email",
      showOnModal: true,
    },
  },
};

export default web3AuthContextConfig;
