import Link from "next/link";
import "./globals.css";
import { ClientOnlyConnect } from "@/components/ClientOnlyConnect";
import { StacksProvider } from "@/providers/StacksProvider";

export const metadata = {
  title: "ClipClash | Performance Battle Platform",
  description: "A decentralized 15-second performance battle platform built on the Stacks blockchain.",
  verification: {
    other: {
      "talentapp:project_verification": [
        "7b3aedcccbd0dc241c224f1024aab974650fe3c168ab450e5404e21efe0595229860a90c8a3511ac61f3d1ef0def26ea72c23a38551e6f3cc6597acf706b46ed",
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <StacksProvider>
          <header className="border-b border-surface/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
                Clip<span className="text-text">Clash</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-muted hover:text-text transition-colors">Arena</Link>
                <Link href="/leaderboard" className="text-sm font-medium text-muted hover:text-text transition-colors">Leaderboard</Link>
              </nav>
              <div className="flex items-center gap-4">
                <ClientOnlyConnect />
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="border-t border-surface/50 py-8 bg-surface/20">
            <div className="container mx-auto px-4 text-center text-sm text-muted">
              <p>&copy; {new Date().getFullYear()} ClipClash. Built on Stacks.</p>
            </div>
          </footer>
        </StacksProvider>
      </body>
    </html>
  );
}
