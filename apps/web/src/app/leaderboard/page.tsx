"use client";

import { useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  name: string;
  address: string;
  wins: number;
  clout: number;
  trend: "up" | "down" | "stable";
}

const MOCK_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "FlowMaster.btc", address: "SP1...A1", wins: 42, clout: 2500, trend: "up" },
  { rank: 2, name: "VibeCheck.stx", address: "SP2...B2", wins: 38, clout: 2100, trend: "stable" },
  { rank: 3, name: "LyricLover.btc", address: "SP3...C3", wins: 35, clout: 1950, trend: "up" },
  { rank: 4, name: "BeatBoxer.stx", address: "SP4...D4", wins: 29, clout: 1800, trend: "down" },
  { rank: 5, name: "StreetDance.btc", address: "SP5...E5", wins: 25, clout: 1650, trend: "up" },
  { rank: 6, name: "Anonymous", address: "SP6...F6", wins: 22, clout: 1400, trend: "stable" },
  { rank: 7, name: "ClipKing.stx", address: "SP7...G7", wins: 18, clout: 1200, trend: "down" },
  { rank: 8, name: "RhymeGenius.btc", address: "SP8...H8", wins: 15, clout: 1100, trend: "up" },
];

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "all">("weekly");
  const [category, setCategory] = useState("all");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 pb-32">
      {/* Header */}
      <div className="space-y-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent italic uppercase">
          Arena Rankings
        </h1>
        <p className="text-muted text-lg font-medium max-w-2xl mx-auto">
          The ultimate hall of fame. Climb the charts by winning performance battles and earning clout from the community.
        </p>
      </div>

      {/* Top 3 Spotlight (Visual Hook) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {/* Rank 2 */}
        <div className="order-2 md:order-1 flex flex-col items-center">
           <div className="w-24 h-24 rounded-full bg-surface border-4 border-muted/50 flex items-center justify-center text-4xl mb-4 grayscale">🥈</div>
           <div className="p-6 rounded-3xl bg-surface/50 border border-surface text-center w-full shadow-lg">
             <p className="text-secondary font-black text-xl mb-1">{MOCK_DATA[1].name}</p>
             <p className="text-muted text-sm font-mono mb-4">{MOCK_DATA[1].clout} Clout</p>
             <div className="bg-surface-dark py-1 px-3 rounded-full text-xs font-bold text-muted inline-block">2nd Place</div>
           </div>
        </div>
        
        {/* Rank 1 */}
        <div className="order-1 md:order-2 flex flex-col items-center transform md:scale-110 md:-translate-y-4">
           <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-accent flex items-center justify-center text-6xl mb-6 shadow-2xl shadow-accent/20 animate-bounce-slow">🥇</div>
           <div className="p-10 rounded-3xl bg-surface border-2 border-accent text-center w-full shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
             </div>
             <p className="text-accent font-black text-3xl mb-2">{MOCK_DATA[0].name}</p>
             <p className="text-text/90 text-lg font-mono mb-6 italic">{MOCK_DATA[0].clout} Clout</p>
             <div className="bg-accent text-background py-2 px-6 rounded-full text-sm font-black uppercase tracking-widest">Grand Champion</div>
           </div>
        </div>

        {/* Rank 3 */}
        <div className="order-3 flex flex-col items-center">
           <div className="w-24 h-24 rounded-full bg-surface border-4 border-accent/30 flex items-center justify-center text-4xl mb-4 opacity-80">🥉</div>
           <div className="p-6 rounded-3xl bg-surface/50 border border-surface text-center w-full shadow-lg">
             <p className="text-primary font-black text-xl mb-1">{MOCK_DATA[2].name}</p>
             <p className="text-muted text-sm font-mono mb-4">{MOCK_DATA[2].clout} Clout</p>
             <div className="bg-surface-dark py-1 px-3 rounded-full text-xs font-bold text-muted inline-block">3rd Place</div>
           </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-3xl bg-surface/30 border border-surface/50">
          <div className="flex bg-background p-1.5 rounded-2xl shadow-inner">
            {(["daily", "weekly", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  timeRange === range 
                    ? "bg-surface text-primary shadow-lg" 
                    : "text-muted hover:text-text"
                }`}
              >
                {range === "all" ? "All Time" : range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-muted uppercase tracking-widest">Category:</span>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background border border-surface rounded-xl px-4 py-2 text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              <option value="all">All Genres</option>
              <option value="rap">Rap / Hip-Hop</option>
              <option value="dance">Dance</option>
              <option value="vocals">Vocals</option>
              <option value="comedy">Comedy</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-surface/50 bg-surface/10 overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface uppercase text-[10px] font-black tracking-[0.2em] text-muted">
                <th className="px-8 py-6">Rank</th>
                <th className="px-8 py-6">Performer</th>
                <th className="px-8 py-6 text-center">Wins</th>
                <th className="px-8 py-6 text-right">Clout Score</th>
                <th className="px-8 py-6 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface/30">
              {MOCK_DATA.slice(3).map((user) => (
                <tr key={user.rank} className="group hover:bg-surface/30 transition-colors">
                  <td className="px-8 py-6 font-heading font-black text-2xl text-muted group-hover:text-primary transition-colors">#{user.rank}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center font-black text-primary shadow-sm border border-surface">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold group-hover:text-text transition-colors">{user.name}</p>
                        <p className="text-xs font-mono text-muted/60">{user.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-secondary">{user.wins}</td>
                  <td className="px-8 py-6 text-right font-mono font-bold text-text/90 tracking-tight">{user.clout.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      user.trend === "up" ? "bg-secondary/10 text-secondary" : 
                      user.trend === "down" ? "bg-error/10 text-error" : 
                      "bg-muted/10 text-muted"
                    }`}>
                      {user.trend === "up" ? "▲" : user.trend === "down" ? "▼" : "•"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
