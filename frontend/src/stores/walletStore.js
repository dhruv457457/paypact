import { create } from 'zustand';
import { web3auth } from '../lib/web3auth.js';

export const useWalletStore = create((set, get) => ({
  // State
  isConnected: false,
  isLoading: false,
  user: null,
  provider: null,
  address: null,
  balance: "0",
  
  // Actions
  connect: async () => {
    set({ isLoading: true });
    
    try {
      console.log("🚀 Starting Web3Auth connection...");
      
      const web3authProvider = await web3auth.connect();
      
      if (web3authProvider && web3auth.connected) {
        console.log("📞 Getting user info...");
        const user = await web3auth.getUserInfo();
        
        console.log("📞 Getting Solana accounts...");
        // Get Solana accounts using the provider
        const accounts = await web3authProvider.request({
          method: "getAccounts",
        });
        
        set({
          isConnected: true,
          provider: web3authProvider,
          user: user,
          address: accounts[0],
          isLoading: false,
        });
        
        console.log("✅ Connected successfully!");
        console.log("👤 User Info:", {
          name: user?.name,
          email: user?.email,
          profileImage: user?.profileImage
        });
        console.log("💰 Solana Address:", accounts[0]);
        
        return true;
      } else {
        console.log("❌ Connection failed - no provider");
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("❌ Connection error:", error);
      set({ isLoading: false });
      
      if (error.message?.includes("User denied") || error.message?.includes("User closed")) {
        console.log("ℹ️ User cancelled the login");
      } else if (error.message?.includes("popup")) {
        alert("Please allow popups for social login to work");
      } else {
        console.error("Login error details:", error);
        alert(`Login failed: ${error.message}`);
      }
      
      return false;
    }
  },

  disconnect: async () => {
    try {
      console.log("🔄 Disconnecting from Web3Auth...");
      
      await web3auth.logout();
      
      set({
        isConnected: false,
        user: null,
        provider: null,
        address: null,
        balance: "0",
      });
      
      console.log("✅ Disconnected successfully");
    } catch (error) {
      console.error("❌ Disconnect error:", error);
    }
  },

  // Get Solana balance
  getBalance: async () => {
    const { provider, address } = get();
    if (provider && address) {
      try {
        const balance = await provider.request({
          method: "getBalance",
          params: [address],
        });
        
        // Convert lamports to SOL
        const balanceInSOL = balance / 1000000000;
        set({ balance: balanceInSOL.toFixed(4) });
        return balanceInSOL;
      } catch (error) {
        console.error("Balance fetch error:", error);
        return 0;
      }
    }
    return 0;
  },

  // Check if already connected on page load
  checkConnection: async () => {
    try {
      if (web3auth.connected) {
        const user = await web3auth.getUserInfo();
        const provider = web3auth.provider;
        
        if (provider) {
          const accounts = await provider.request({
            method: "getAccounts",
          });
          
          set({
            isConnected: true,
            user,
            provider,
            address: accounts[0],
          });
          
          return true;
        }
      }
    } catch (error) {
      console.error("Check connection error:", error);
    }
    return false;
  },
}));
