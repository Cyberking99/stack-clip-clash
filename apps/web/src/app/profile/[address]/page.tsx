"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useStacks } from "@/providers/StacksProvider";
import { useParams } from "next/navigation";
import { openContractCall } from "@stacks/connect";
import { 
  CONTRACT_ADDRESS, 
  USER_REGISTRY_CONTRACT, 
  NETWORK 
} from "@/lib/constants";
import { Cl } from "@stacks/transactions";

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const { stats, loading, error } = useUserProfile(address);
  const { userData, isSignedIn } = useStacks();

  const isOwnProfile = isSignedIn && 
    (userData?.profile?.stxAddress?.mainnet === address || 
     userData?.profile?.stxAddress?.testnet === address);

  const handleLinkBNS = () => {
    // In a real app, this would prompt for a BNS name
    const bnsName = prompt("Enter your BNS name (e.g. performer.btc):");
    if (!bnsName) return;

    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: USER_REGISTRY_CONTRACT,
      functionName: "register-user",
      functionArgs: [Cl.some(Cl.stringAscii(bnsName))],
      network: NETWORK,
      onFinish: (data) => {
        console.log("BNS Link Transaction sent:", data);
        alert("Transaction sent! Your profile will update once confirmed.");
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-transparent"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-error mb-2">Error</h2>
        <p className="text-muted">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      {/* Profile Header */}
      <div className="relative mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-br from-primary/20 via-surface to-secondary/20 border border-surface/50 overflow-hidden shadow-inner">
           <div className="absolute inset-0 bg-grid-white/5"></div>
        </div>
        
        <div className="absolute -bottom-12 left-8 flex flex-col md:flex-row items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-background border-4 border-background shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl font-heading font-black text-text/20">
              {stats.bnsName ? stats.bnsName.charAt(0).toUpperCase() : "CC"}
            </div>
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-text flex items-center gap-3">
              {stats.bnsName || "Anonymous Performer"}
              {isOwnProfile && !stats.bnsName && (
                <button 
                  onClick={handleLinkBNS}
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  Link BNS
                </button>
              )}
            </h1>
            <p className="text-muted font-mono text-sm md:text-base mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {address}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        {/* Left Col: Stats & Info */}
        <div className="md:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="p-8 rounded-3xl bg-surface/50 border border-surface shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted mb-8 border-b border-surface pb-4">On-Chain Stats</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-center group">
                <span className="text-muted font-bold">Performance Clout</span>
                <span className="text-3xl font-heading font-black text-primary group-hover:scale-110 transition-transform">{stats.clout}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-muted font-bold">Battles Won</span>
                <span className="text-3xl font-heading font-black text-green-500 group-hover:scale-110 transition-transform">{stats.wins}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-muted font-bold">Battles Lost</span>
                <span className="text-3xl font-heading font-black text-error group-hover:scale-110 transition-transform">{stats.losses}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-surface/50 border border-surface shadow-xl">
             <h3 className="text-sm font-black uppercase tracking-widest text-muted mb-6">Trophy Cabinet</h3>
             <div className="flex flex-wrap gap-4 opacity-30 hover:opacity-50 transition-opacity">
                {[1,2,3].map(i => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-surface-dark border border-surface flex items-center justify-center text-2xl grayscale">🏅</div>
                ))}
             </div>
             <p className="text-xs text-muted mt-6 text-center italic">Win battles to unlock NFT trophies.</p>
          </div>
        </div>

        {/* Right Col: Media Gallery / Battles */}
        <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight">Performance Gallery</h2>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-xl bg-surface font-bold text-sm shadow-sm border border-surface">Battles</button>
               <button className="px-4 py-2 rounded-xl bg-surface/30 font-bold text-sm text-muted">Clips</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
               <div key={i} className="aspect-[9/16] rounded-3xl bg-surface/30 border border-surface flex flex-col items-center justify-center p-8 text-center space-y-4 group cursor-help overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-full bg-surface/50 border border-surface flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-muted group-hover:text-text transition-colors relative z-10">Video Data (Phase 3)</p>
                  <p className="text-xs text-muted/60 relative z-10">Historical Battle #{i}</p>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
