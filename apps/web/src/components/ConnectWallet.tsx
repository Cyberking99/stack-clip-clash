"use client";

import { useStacks } from "@/providers/StacksProvider";
import { useState, useRef, useEffect } from "react";

export function ConnectWallet() {
  const { userData, connect, disconnect, isSignedIn } = useStacks();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  if (isSignedIn && userData) {
    const address = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full bg-surface hover:bg-surface/80 transition-all border border-surface/50 shadow-sm"
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
          <span className="font-mono">{truncateAddress(address)}</span>
          <svg
            className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-background border border-surface shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-surface/50 mb-1">
              <p className="text-xs text-muted uppercase font-bold tracking-wider">Account</p>
              <p className="text-sm font-medium truncate">{address}</p>
            </div>
            <a
              href={`/profile/${address}`}
              className="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </a>
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-6 py-2 text-sm font-bold rounded-full bg-primary hover:bg-primary/90 text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
    >
      Connect Wallet
    </button>
  );
}
