# ClipClash: Performance Battle Platform on Stacks

ClipClash is a decentralized performance battle platform where users upload 15-second clips to compete head-to-head. Built on the **Stacks blockchain**, it leverages Bitcoin's security for voting and rewards.

## 🚀 Overview

ClipClash utilizes a multi-platform strategy:
- **Next.js Web Portal**: The primary hub for discovery, governance, and viewing battles.
- **Expo Mobile Studio**: The primary tool for content creation, featuring a 15-second performance recorder.
- **Clarity Smart Contracts**: Managing the $CLASH utility token, user registration, and battle logic.

## 🏗 Project Structure

This project is a monorepo managed by **Turborepo** and **pnpm**:

```text
clipclash-monorepo/
├── apps/
│   ├── web/                # Next.js 14 (App Router)
│   └── mobile/             # React Native (Expo)
├── packages/
│   ├── clarity/            # Clarity Smart Contracts (Coming soon)
│   ├── ui-config/          # Shared Design Tokens (Tailwind/NativeWind)
│   ├── typescript-config/  # Shared TS configurations
│   └── eslint-config/      # Shared Linting rules
├── turbo.json              # Turborepo build pipeline
└── pnpm-workspace.yaml     # pnpm workspace definition
```

## 🛠 Tech Stack

- **Blockchain**: Clarity (Stacks Layer 2 for Bitcoin)
- **Web**: Next.js 14, Tailwind CSS, @stacks/connect
- **Mobile**: React Native (Expo), NativeWind, @stacks/connect (Deep-linking)
- **Storage**: IPFS (via Pinata)
- **Database**: Prisma + PostgreSQL (Indexing layer)

## 🏁 Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/) (LTS)
- [Clarinet](https://github.com/hirosystems/clarinet) (For smart contract development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stack-clip-clash
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run all apps in development mode:
```bash
pnpm dev
```

Or run specific workspace:
```bash
pnpm dev --filter web
pnpm dev --filter mobile
```

## 📄 License

MIT
