"use client";

import { useState, useEffect } from "react";
import { 
  fetchCallReadOnlyFunction, 
  cvToValue, 
  Cl
} from "@stacks/transactions";
import { 
  CONTRACT_ADDRESS, 
  USER_REGISTRY_CONTRACT, 
  NETWORK, 
  API_URL 
} from "@/lib/constants";

export interface UserStats {
  wins: number;
  losses: number;
  clout: number;
  bnsName: string | null;
}

export function useUserProfile(address: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!address) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch BNS Names
        const bnsResponse = await fetch(`${API_URL}/v1/addresses/stacks/${address}/names`);
        const bnsData = await bnsResponse.json();
        const primaryName = bnsData.names && bnsData.names.length > 0 ? bnsData.names[0] : null;

        // 2. Fetch Registry Stats from Smart Contract
        const result = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: USER_REGISTRY_CONTRACT,
          functionName: "get-user",
          functionArgs: [Cl.principal(address)],
          network: NETWORK,
          senderAddress: address,
        });

        const value = cvToValue(result);
        console.log("Registry Stats value:", value);
        
        // Stacks.js v7 cvToValue for tuples might return { value: ... } for each field or direct values
        const extractNum = (val: any) => {
          if (val === null || val === undefined) return 0;
          if (typeof val === 'object' && 'value' in val) return Number(val.value);
          return Number(val);
        };

        setStats({
          wins: extractNum(value.wins),
          losses: extractNum(value.losses),
          clout: extractNum(value.clout),
          bnsName: primaryName,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [address]);

  return { stats, loading, error };
}
