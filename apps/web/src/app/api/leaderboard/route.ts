import { NextResponse } from "next/server";
import { getLeaderboardCache } from "@/lib/leaderboard-cache";

export async function GET() {
  try {
    const entries = getLeaderboardCache();

    if (entries.length === 0) {
      return NextResponse.json({ entries: [], message: "No entries found." });
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
