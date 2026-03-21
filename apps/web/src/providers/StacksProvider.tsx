"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppConfig, UserSession, showConnect, UserData } from "@stacks/connect";

interface StacksContextType {
  userSession: UserSession;
  userData: UserData | null;
  connect: () => void;
  disconnect: () => void;
  isSignedIn: boolean;
}

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

const StacksContext = createContext<StacksContextType | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: "ClipClash",
        icon: typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "",
      },
      redirectTo: "/",
      onFinish: () => {
        setUserData(userSession.loadUserData());
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut("/");
    setUserData(null);
  };

  const value = {
    userSession,
    userData,
    connect,
    disconnect,
    isSignedIn: !!userData,
  };

  return <StacksContext.Provider value={value}>{children}</StacksContext.Provider>;
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error("useStacks must be used within a StacksProvider");
  }
  return context;
}
