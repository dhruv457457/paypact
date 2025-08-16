// src/pages/Profile.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useWeb3Auth, useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { listPactsByCreator, listPactsForWallet } from "../lib/pacts";
import { FaWallet, FaHourglassHalf, FaStar, FaCheckCircle as FaCheckCircleSolid } from "react-icons/fa";

// ... (SVG and StatCard components remain the same)

const StatCard = ({ icon, title, value, isLoading }: { icon: React.ReactNode; title: string; value: string | number; isLoading: boolean }) => (
    <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-gray-400">
            <span className="text-sm font-medium">{title}</span>
            {icon}
        </div>
        <div>
            {isLoading ? (
                 <div className="h-8 bg-gray-700 rounded-md animate-pulse mt-2"></div>
            ) : (
                <p className="text-2xl font-semibold text-white mt-2">{value}</p>
            )}
        </div>
    </div>
);


export default function Profile() {
  const { status } = useWeb3Auth();
  const { connect, isConnected, loading: connectLoading } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { accounts, connection } = useSolanaWallet();

  // ... (rest of the states and functions remain the same)
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  const [organizerPacts, setOrganizerPacts] = useState<any[]>([]);
  const [participantPacts, setParticipantPacts] = useState<any[]>([]);
  const [loadingPacts, setLoadingPacts] = useState(false);

  // Settings
  const [showOrganizedPacts, setShowOrganizedPacts] = useState(true);
  const [showParticipantPacts, setShowParticipantPacts] = useState(true);
  
  const [activeTab, setActiveTab] = useState("Activity");

  const addressAvailable = accounts && accounts.length > 0;
  const walletAddress = addressAvailable ? accounts[0] : null;

  const fetchBalance = async () => {
    if (connection && addressAvailable) {
      try {
        setLoadingBalance(true);
        const lamports = await connection.getBalance(new PublicKey(accounts[0]));
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (err: any) { console.error(err); setBalance(null); } 
      finally { setLoadingBalance(false); }
    } else { setBalance(null); }
  };

  const fetchPacts = async () => {
    if (walletAddress) {
        setLoadingPacts(true);
        try {
            const [organized, participating] = await Promise.all([
                listPactsByCreator(walletAddress),
                listPactsForWallet(walletAddress)
            ]);
            setOrganizerPacts(organized);
            setParticipantPacts(participating);
        } catch (error) { console.error("Failed to fetch pacts:", error); } 
        finally { setLoadingPacts(false); }
    }
  }

  useEffect(() => {
    if(isConnected && walletAddress) {
      fetchBalance();
      fetchPacts();
    }
  }, [connection, accounts, isConnected]);

  const { pendingBalance, reputationScore, completedTxs, activityFeed } = useMemo(() => {
      let pending = 0;
      let completed = 0;
      let score = 0;
      let feed: any[] = [];

      participantPacts.forEach(pact => {
          const myParticipantInfo = pact.participants.find((p: any) => p.wallet === walletAddress);
          if (myParticipantInfo && !myParticipantInfo.paid) {
              pending += pact.amountPerPerson;
          }
          if (myParticipantInfo && myParticipantInfo.paid) {
              completed++;
              score += 5; // +5 for each pact paid
              feed.push({ type: 'Paid Pact', name: pact.name, date: myParticipantInfo.paidAt || pact.createdAt?.toDate(), amount: pact.amountPerPerson, status: 'Completed' });
          }
      });
      
      organizerPacts.forEach(pact => {
          feed.push({ type: 'Created Pact', name: pact.name, date: pact.createdAt?.toDate(), status: 'Created' });
          const isPactComplete = pact.participants.every((p: any) => p.paid);
          if (isPactComplete) {
            score += 10; // +10 for each completed pact organized
            completed += pact.participants.length;
          }
      });
      
      feed.sort((a,b) => (b.date || 0) - (a.date || 0));

      return {
          pendingBalance: pending.toFixed(4),
          reputationScore: score,
          completedTxs: completed,
          activityFeed: feed
      };

  }, [organizerPacts, participantPacts, walletAddress]);

  if (status === 'not_ready' || status === 'connecting') {
    return (
        <div className="relative min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center">
            <p className="text-gray-400">Initializing Wallet...</p>
        </div>
    )
  }

  if (!isConnected) {
    return (
        <div className="relative min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to view your activity and manage your pacts.</p>
             <button
                onClick={() => connect()}
                disabled={connectLoading}
                className="font-semibold py-3 px-8 rounded-md transition-colors bg-[#7f48de] hover:bg-[#7437DC] disabled:bg-gray-600 disabled:cursor-not-allowed"
             >
                {connectLoading ? "Connecting..." : "Connect Wallet"}
            </button>
        </div>
    )
  }

  return (
    // ... (rest of the JSX remains the same)
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-24">
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        <div>
            <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
            <p className="text-gray-400 mt-1">Welcome back, here is your overview.</p>
        </div>

        {/* --- STATS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<FaWallet />} title="Wallet Balance" value={`${balance !== null ? balance.toFixed(4) : '--'} SOL`} isLoading={loadingBalance} />
            <StatCard icon={<FaHourglassHalf />} title="Pending Balance" value={`${pendingBalance} SOL`} isLoading={loadingPacts} />
            <StatCard icon={<FaStar />} title="Reputation Score" value={reputationScore} isLoading={loadingPacts} />
            <StatCard icon={<FaCheckCircleSolid />} title="Completed Txs" value={completedTxs} isLoading={loadingPacts} />
        </div>

        {/* --- TABS --- */}
        <div className="border-b border-[#1C1C1E]">
            <nav className="-mb-px flex space-x-6">
                {["Activity", "My Pacts", "Settings"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                        {tab}
                    </button>
                ))}
            </nav>
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-6 min-h-[300px]">
            {activeTab === 'Activity' && (
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Activity Feed</h3>
                    <div className="space-y-4">
                        {activityFeed.length > 0 ? activityFeed.map((item, index) => (
                           <div key={index} className="flex justify-between items-center text-sm">
                               <div>
                                   <p className="font-medium text-white">{item.type}: <span className="text-gray-300">{item.name}</span></p>
                                   <p className="text-gray-500">{item.date ? new Date(item.date).toLocaleString() : 'N/A'}</p>
                               </div>
                               <div className="text-right">
                                    {item.amount && <p className={`font-mono ${item.type === 'Paid Pact' ? 'text-green-400' : 'text-red-400'}`}>{item.type === 'Paid Pact' ? '+' : '-'}{item.amount.toFixed(4)} SOL</p>}
                                    <p className={`font-medium ${item.status === 'Completed' ? 'text-green-500' : 'text-gray-400'}`}>{item.status}</p>
                               </div>
                           </div>
                        )) : <p className="text-gray-500">No activity yet.</p>}
                    </div>
                </div>
            )}
            {activeTab === 'My Pacts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Pacts You've Organized</h3>
                        <div className="space-y-3">
                            {organizerPacts.length > 0 ? organizerPacts.map(pact => (
                                <Link to={`/pact/${pact.id}`} key={pact.id} className="block bg-[#1C1C1E] p-3 rounded-md border border-[#3A3A3C] hover:border-purple-500 transition-colors">
                                    <p className="font-semibold text-purple-400">{pact.name}</p>
                                    <p className="text-sm text-gray-400">Due: {new Date(pact.dueDate).toLocaleDateString()}</p>
                                </Link>
                            )) : <p className="text-gray-500">You haven't organized any pacts.</p>}
                        </div>
                     </div>
                     <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Pacts You're In</h3>
                        <div className="space-y-3">
                           {participantPacts.length > 0 ? participantPacts.map(pact => (
                                <Link to={`/pact/${pact.id}`} key={pact.id} className="block bg-[#1C1C1E] p-3 rounded-md border border-[#3A3A3C] hover:border-purple-500 transition-colors">
                                    <p className="font-semibold text-purple-400">{pact.name}</p>
                                    <p className="text-sm text-gray-400">Due: {new Date(pact.dueDate).toLocaleDateString()}</p>
                                </Link>
                            )) : <p className="text-gray-500">You haven't joined any pacts.</p>}
                        </div>
                     </div>
                </div>
            )}
            {activeTab === 'Settings' && (
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Profile Settings</h3>
                     <div className="space-y-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="showOrganized" checked={showOrganizedPacts} onChange={(e) => setShowOrganizedPacts(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"/>
                            <label htmlFor="showOrganized" className="ml-3 block text-sm text-gray-300">Show Pacts I've Organized on public profile</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showParticipant" checked={showParticipantPacts} onChange={(e) => setShowParticipantPacts(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"/>
                            <label htmlFor="showParticipant" className="ml-3 block text-sm text-gray-300">Show Pacts I'm In on public profile</label>
                        </div>
                        <div className="pt-4">
                             <button
                                onClick={() => disconnect({ cleanup: true })}
                                disabled={disconnectLoading}
                                className="font-semibold py-2 px-6 rounded-md transition-colors bg-red-800 hover:bg-red-700 disabled:bg-gray-600"
                            >
                                {disconnectLoading ? "Disconnecting..." : "Disconnect Wallet"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}