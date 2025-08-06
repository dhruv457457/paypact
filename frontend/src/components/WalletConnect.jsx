import React, { useEffect, useState } from 'react';
import { useWalletStore } from '../stores/walletStore.js';
import { initWeb3Auth } from '../lib/web3auth.js';

export const WalletConnect = () => {
  const { 
    isConnected, 
    isLoading, 
    user, 
    address, 
    connect, 
    disconnect,
    checkConnection 
  } = useWalletStore();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const init = async () => {
      console.log("🔄 Starting official Web3Auth setup...");
      
      try {
        const success = await initWeb3Auth();
        
        if (success) {
          setIsInitialized(true);
          setInitError(null);
          
          // Check if already connected
          await checkConnection();
          
          console.log("🎉 Web3Auth ready for social login!");
        } else {
          setInitError("Failed to initialize Web3Auth");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setInitError(error.message);
      }
    };
    
    init();
  }, [checkConnection]);

  const handleConnect = async () => {
    if (!isInitialized) {
      alert("Web3Auth is still initializing...");
      return;
    }
    
    console.log("🎯 Starting social login flow...");
    await connect();
  };

  if (initError) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
        <div className="text-4xl mb-3">❌</div>
        <h3 className="text-lg font-bold text-red-800 mb-2">
          Web3Auth Setup Error
        </h3>
        <p className="text-red-600 text-sm mb-4">
          {initError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Reload & Retry
        </button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Setting up Web3Auth...
        </h3>
        <p className="text-gray-600 text-center">
          Preparing social login & embedded wallets
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div className="space-y-4">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all disabled:opacity-50 shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <span className="text-3xl mr-3">🌐</span>
                  <span>Connect with Social Login</span>
                </div>
                <div className="text-sm opacity-90 flex items-center space-x-2">
                  <span>🔵 Google</span>
                  <span>•</span>
                  <span>🐦 Twitter</span>
                  <span>•</span>
                  <span>📧 Email</span>
                </div>
              </div>
            )}
          </button>
          
          <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">✨ What You Get:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>🔑 No MetaMask installation needed</div>
              <div>💰 Automatic embedded wallet creation</div>
              <div>🌍 Cross-chain DeFi ready</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Success Card */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🎉</span>
                  <h3 className="text-2xl font-bold text-green-800">
                    Social Login Success!
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="text-green-700">
                    <strong>👤 Welcome:</strong> {user?.name || user?.email || "User"}
                  </div>
                  
                  {user?.email && (
                    <div className="text-green-700">
                      <strong>📧 Email:</strong> {user.email}
                    </div>
                  )}
                  
                  <div className="text-green-700">
                    <strong>💰 Embedded Wallet:</strong>
                    <div className="font-mono text-sm bg-green-100 px-3 py-2 rounded-lg mt-2 break-all">
                      {address}
                    </div>
                  </div>
                </div>
              </div>
              
              {user?.profileImage && (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full border-4 border-green-300 shadow-lg ml-4 flex-shrink-0"
                />
              )}
            </div>
          </div>
          
          {/* Ready Status */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">🚀 Ready for Phase 2:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
              <div>✅ Solana contract calls</div>
              <div>✅ Cross-chain bridges</div>
              <div>✅ Token operations</div>
              <div>✅ Portfolio tracking</div>
            </div>
          </div>
          
          <button
            onClick={disconnect}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors font-semibold"
          >
            Disconnect Social Login
          </button>
        </div>
      )}
    </div>
  );
};
