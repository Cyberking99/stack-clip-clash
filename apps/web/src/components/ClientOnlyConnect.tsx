"use client";

import dynamic from "next/dynamic";

const ConnectWallet = dynamic(
    () => import("./ConnectWallet").then((mod) => mod.ConnectWallet),
    { ssr: false }
);

export function ClientOnlyConnect() {
    return <ConnectWallet />;
}
