"use client";

import { useState, useEffect } from "react";
import { 
  fetchCallReadOnlyFunction, 
  cvToValue, 
  Cl 
} from "@stacks/transactions";
import { 
  CONTRACT_ADDRESS, 
  CLASH_TOKEN_CONTRACT, 
  NETWORK 
} from "@/lib/constants";

export function useClashBalance(address: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      if (!address) {
        setBalance(0);
        setLoading(false);
        return;
      }

      try {
        const result = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CLASH_TOKEN_CONTRACT,
          functionName: "get-balance",
          functionArgs: [Cl.principal(address)],
          network: NETWORK,
          senderAddress: address,
        });

        // The result is an (ok uint)
        const value = cvToValue(result);
        setBalance(Number(value.value));
      } catch (err) {
        console.error("Error fetching CLASH balance:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [address]);

  return { balance, loading };
}
