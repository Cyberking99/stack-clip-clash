"use client";

import { useEffect, useState } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export function ConnectWallet() {
    const [mounted, setMounted] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    const connect = () => {
        showConnect({
            appDetails: {
                name: "ClipClash MVP",
                icon: window.location.origin + "/favicon.ico",
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

    if (!mounted) return null;

    if (userData) {
        return (
            <button
                onClick={disconnect}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-surface hover:bg-surface/80 transition-colors border border-surface"
            >
                Disconnect
            </button>
        );
    }

    return (
        <button
            onClick={connect}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
        >
            Connect Wallet
        </button>
    );
}
