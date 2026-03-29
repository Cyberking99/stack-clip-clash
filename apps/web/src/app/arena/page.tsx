"use client";

import React, { useState, useEffect } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useClashBalance } from "@/hooks/useClashBalance";
import { openContractCall } from "@stacks/connect";
import { Cl } from "@stacks/transactions";
import { 
  CONTRACT_ADDRESS, 
  BATTLE_MANAGER_CONTRACT, 
  NETWORK 
} from "@/lib/constants";
import VideoPlayer from "@/components/Arena/VideoPlayer";

interface Performer {
  id: string;
  name: string;
  avatar?: string;
  videoUrl: string;
  votes: number;
}

export default function ArenaPage() {
  const { userData } = useStacks();
  const address = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet;
  const { balance, loading: balanceLoading } = useClashBalance(address);

  const [battle, setBattle] = useState<{
    id: string;
    performerA: Performer;
    performerB: Performer;
    timeLeft: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchBattle() {
      try {
        const response = await fetch("/api/arena");
        const data = await response.json();
        setBattle(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch battle:", error);
      }
    }
    fetchBattle();
  }, []);

  useEffect(() => {
    if (!battle || battle.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setBattle(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [battle?.timeLeft]);

  const handleVote = async (performerId: string) => {
    if (!address) {
      alert("Please connect your wallet to vote!");
      return;
    }

    const voteFor = performerId === battle?.performerA.id ? 1 : 2;

    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: BATTLE_MANAGER_CONTRACT,
      functionName: "vote",
      functionArgs: [
        Cl.uint(parseInt(battle?.id.split("_")[1] || "0")),
        Cl.uint(voteFor)
      ],
      network: NETWORK,
      onFinish: async (data) => {
        console.log("Vote Transaction sent:", data);
        
        // Update local cache and state immediately for better UX
        try {
          const response = await fetch("/api/arena", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ battleId: battle?.id, performerId }),
          });

          if (response.ok) {
            const updatedBattle = await response.json();
            setBattle(updatedBattle);
            setHasVoted(true);
          }
        } catch (error) {
          console.error("Failed to update local cache:", error);
        }
      },
    });
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050510]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#FF3D00] border-t-transparent"></div>
      </div>
    );
  }

  if (!battle) return null;

  const totalVotes = battle.performerA.votes + battle.performerB.votes;
  const percentA = Math.round((battle.performerA.votes / totalVotes) * 100);
  const percentB = 100 - percentA;

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Header Info */}
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-2 text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF3D00] to-[#FF8A00]">
          THE ARENA
        </h1>
        <p className="text-gray-400">Battle #{battle.id.split("_")[1]} is heating up!</p>
        
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {/* Timer */}
            <div className="inline-flex items-center rounded-full bg-white/5 px-6 py-2 border border-white/10">
                <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                <span className="font-mono text-xl">{Math.floor(battle.timeLeft / 60)}:{(battle.timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>

            {/* Token Balance */}
            {address && (
                <div className="inline-flex items-center rounded-full bg-primary/10 px-6 py-2 border border-primary/20">
                    <span className="mr-2 text-primary font-bold">$CLASH:</span>
                    <span className="font-mono text-xl">
                        {balanceLoading ? "..." : (balance / 1000000).toLocaleString()}
                    </span>
                </div>
            )}

            {/* Connect Wallet if not connected */}
            {!address && (
                <button 
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center rounded-full bg-primary px-6 py-2 border border-primary/20 font-bold hover:bg-primary/80 transition-all"
                >
                    Connect Wallet to Vote
                </button>
            )}
        </div>
      </div>

      {/* Battle Layout */}
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 pb-20 lg:flex-row lg:items-stretch lg:justify-center">
        
        {/* Performer A */}
        <div className="group relative w-full overflow-hidden rounded-3xl border-2 border-white/5 bg-white/5 transition-all hover:border-[#FF3D00]/50 lg:w-[45%]">
            <VideoPlayer url={battle.performerA.videoUrl} />
            
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">{battle.performerA.name}</h3>
                        <p className="text-sm text-gray-500">Votes: {battle.performerA.votes}</p>
                    </div>
                </div>
                
                <button 
                    className="w-full bg-gradient-to-r from-[#FF3D00] to-[#FF8A00] py-4 text-lg font-bold shadow-[0_0_20px_rgba(255,61,0,0.3)] hover:shadow-[0_0_30px_rgba(255,61,0,0.5)] rounded-xl"
                    onClick={() => handleVote(battle.performerA.id)}
                    disabled={hasVoted}
                >
                    {hasVoted ? "VOTE REGISTERED" : "VOTE FOR FIRE 🔥"}
                </button>
            </div>
        </div>

        {/* VS Indicator */}
        <div className="flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#FF3D00]/20 bg-[#050510] font-black italic text-4xl text-[#FF3D00]">
                VS
                <div className="absolute -inset-2 animate-pulse rounded-full border border-[#FF3D00]/10"></div>
            </div>
        </div>

        {/* Performer B */}
        <div className="group relative w-full overflow-hidden rounded-3xl border-2 border-white/5 bg-white/5 transition-all hover:border-[#8A2BE2]/50 lg:w-[45%]">
            <VideoPlayer url={battle.performerB.videoUrl} />
            
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">{battle.performerB.name}</h3>
                        <p className="text-sm text-gray-500">Votes: {battle.performerB.votes}</p>
                    </div>
                </div>
                
                <button 
                    className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#4B0082] py-4 text-lg font-bold shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] rounded-xl"
                    onClick={() => handleVote(battle.performerB.id)}
                    disabled={hasVoted}
                >
                    {hasVoted ? "VOTE REGISTERED" : "VOTE FOR VIBE 💎"}
                </button>
            </div>
        </div>

      </div>

      {/* Voting Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#050510]/80 p-4 backdrop-blur-xl">
        <div className="container mx-auto">
            <div className="mb-2 flex justify-between text-sm font-bold uppercase tracking-widest text-gray-400">
                <span>{battle.performerA.name} ({percentA}%)</span>
                <span>{battle.performerB.name} ({percentB}%)</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div 
                    className="h-full bg-gradient-to-r from-[#FF3D00] to-[#FF8A00] transition-all duration-1000"
                    style={{ width: `${percentA}%` }}
                ></div>
                <div 
                    className="h-full bg-gradient-to-l from-[#8A2BE2] to-[#4B0082] transition-all duration-1000"
                    style={{ width: `${percentB}%` }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
}
