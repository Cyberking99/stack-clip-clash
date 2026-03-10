import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight">
          Welcome to the Arena
        </h1>
        <p className="text-lg text-muted">
          Compete in 15-second performance battles. Stake your claim, win $CLASH, and climb the leaderboard on the Stacks blockchain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-8">
        <div className="p-6 rounded-2xl bg-surface border border-surface hover:border-primary/50 transition-colors">
          <h3 className="font-heading text-xl font-bold mb-2">Active Battles</h3>
          <p className="text-sm text-muted mb-4">Watch and vote on live performances to earn curator rewards.</p>
          <button className="w-full py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors">
            Enter Arena
          </button>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-surface hover:border-secondary/50 transition-colors">
          <h3 className="font-heading text-xl font-bold mb-2">Top Performers</h3>
          <p className="text-sm text-muted mb-4">See who is dominating the charts this week in the hall of fame.</p>
          <Link href="/leaderboard" className="block w-full py-2 bg-secondary/10 text-secondary font-semibold rounded-lg hover:bg-secondary/20 transition-colors">
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
