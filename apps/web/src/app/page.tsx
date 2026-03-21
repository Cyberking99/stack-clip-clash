"use client";

import Link from "next/link";
import { useStacks } from "@/providers/StacksProvider";

export default function Home() {
  const { isSignedIn, userData } = useStacks();
  
  const address = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
      <div className="space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to the Arena
        </h1>
        <p className="text-lg md:text-xl text-muted leading-relaxed">
          {isSignedIn ? (
            <>
              Welcome back, <span className="text-text font-mono font-bold">{address?.slice(0, 8)}</span>!
              Ready to climb the leaderboard and stake your claim?
            </>
          ) : (
            "Compete in 15-second performance battles. Stake your claim, win $CLASH, and dominate the charts."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8 px-4">
        <div className="group p-8 rounded-3xl bg-surface/50 border border-surface hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold mb-3">Active Battles</h3>
          <p className="text-muted mb-6 leading-relaxed">Watch and vote on live performances to earn rewards and influence the rankings.</p>
          <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Enter Arena
          </button>
        </div>
        
        <div className="group p-8 rounded-3xl bg-surface/50 border border-surface hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/5">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold mb-3">Leaderboard</h3>
          <p className="text-muted mb-6 leading-relaxed">See who is dominating the charts and check your own ranking in the community.</p>
          <Link href="/leaderboard" className="block w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors text-center shadow-lg shadow-secondary/20">
            View Rankings
          </Link>
        </div>
      </div>
      
      {!isSignedIn && (
        <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
           <p className="text-sm text-muted mb-4 font-medium uppercase tracking-widest">Powered by Stacks Blockchain</p>
           <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="https://cryptologos.cc/logos/stacks-stx-logo.png" alt="Stacks" className="h-8" />
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" className="h-8" />
           </div>
        </div>
      )}
    </div>
  );
}
