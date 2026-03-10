"use client";

import { useEffect, useState } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

const getAppConfig = () => new AppConfig(["store_write", "publish_data"]);
const getUserSession = () => new UserSession({ appConfig: getAppConfig() });

export function ConnectWallet() {
    const [mounted, setMounted] = useState(false);
    const [userSession, setUserSession] = useState<UserSession | null>(null);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        const session = getUserSession();
        setUserSession(session);

        if (session.isSignInPending()) {
            session.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (session.isUserSignedIn()) {
            setUserData(session.loadUserData());
        }
    }, []);

    const connect = () => {
        if (!userSession) return;
        showConnect({
            appDetails: {
                name: "ClipClash MVP",
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
        if (!userSession) return;
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
