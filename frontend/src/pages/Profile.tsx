// src/pages/Profile.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useWeb3Auth, useWeb3AuthConnect } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { listPactsByCreator, listPactsForWallet } from "../lib/pacts";
import { FaWallet, FaPlusSquare, FaUsers, FaSyncAlt, FaUser } from "react-icons/fa";

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
  const { accounts, connection } = useSolanaWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [organizerPacts, setOrganizerPacts] = useState<any[]>([]);
  const [participantPacts, setParticipantPacts] = useState<any[]>([]);
  const [loadingPacts, setLoadingPacts] = useState(false);
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

  const { pactsOrganized, pactsJoined, totalVolumePaid, activityFeed, allPacts } = useMemo(() => {
    let volumePaid = 0;
    let feed: any[] = [];

    participantPacts.forEach(pact => {
        const myParticipantInfo = pact.participants.find((p: any) => p.wallet === walletAddress);
        if (myParticipantInfo && myParticipantInfo.paid) {
            volumePaid += pact.amountPerPerson;
            feed.push({ type: 'Paid Pact', name: pact.name, date: myParticipantInfo.paidAt || pact.createdAt?.toDate(), amount: pact.amountPerPerson, status: 'Completed' });
        }
    });
    
    organizerPacts.forEach(pact => {
        feed.push({ type: 'Created Pact', name: pact.name, date: pact.createdAt?.toDate(), status: 'Created' });
    });
    
    feed.sort((a,b) => (b.date || 0) - (a.date || 0));

    const combinedPacts = [...organizerPacts];
    participantPacts.forEach(pact => {
        if (!combinedPacts.find(op => op.id === pact.id)) {
            combinedPacts.push(pact);
        }
    });

    return {
        pactsOrganized: organizerPacts.length,
        pactsJoined: participantPacts.length,
        totalVolumePaid: volumePaid.toFixed(4),
        activityFeed: feed,
        allPacts: combinedPacts
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
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-14">
      <div className="relative z-10 lg:px-40 mx-auto p-6 space-y-8 border-t border-[#1C1C1E]">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
                <p className="text-gray-400 mt-1">Welcome back, here is your overview.</p>
            </div>
        </div>

        {/* --- STATS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<FaWallet />} title="Wallet Balance" value={`${balance !== null ? balance.toFixed(4) : '--'} SOL`} isLoading={loadingBalance} />
            <StatCard icon={<FaPlusSquare />} title="Pacts Organized" value={pactsOrganized} isLoading={loadingPacts} />
            <StatCard icon={<FaUsers />} title="Pacts Joined" value={pactsJoined} isLoading={loadingPacts} />
            <StatCard icon={<FaSyncAlt />} title="Total Volume Paid" value={`${totalVolumePaid} SOL`} isLoading={loadingPacts} />
        </div>

        {/* --- TABS --- */}
        <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl p-2 flex space-x-2">
            {["Activity", "Pacts"].map(tab => (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-[#1C1C1E] text-white' : 'text-gray-400 hover:bg-[#151517] hover:text-white'}`}
                >
                    {tab}
                </button>
            ))}
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
            {activeTab === 'Pacts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingPacts ? (
                        <p className="text-gray-400 col-span-full text-center">Loading your pacts...</p>
                    ) : allPacts.length > 0 ? (
                        allPacts.map((p: any) => {
                            const paidCount = (p.participants || []).filter(
                                (x: any) => x.paid
                            ).length;
                            const total = (p.participants || []).length;
                            const progress = total > 0 ? (paidCount / total) * 100 : 0;
                            const totalCollected = paidCount * p.amountPerPerson;

                            return (
                                <Link
                                    to={`/pact/${p.id}`}
                                    key={p.id}
                                    className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                                >
                                    <div className="p-5">
                                        <h3 className="font-semibold text-lg text-white truncate">
                                            {p.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            <span className="font-semibold text-green-400">
                                                {p.amountPerPerson} SOL
                                            </span>{" "}
                                            per person
                                        </p>
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                                                <span>Collection Progress</span>
                                                <span>
                                                    {paidCount} / {total} Paid
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700">
                                                <div
                                                    className="bg-gradient-to-r from-[#7f48de] to-[#7437DC] h-full rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" px-5 py-3 border-t border-[#1C1C1E] text-sm flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <FaUser />
                                            <span>{total} Participants</span>
                                        </div>
                                        <span className="font-semibold text-green-400">
                                            {totalCollected.toFixed(4)} SOL
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">You are not part of any pacts yet.</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}