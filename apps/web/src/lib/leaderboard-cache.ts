import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), "leaderboard-cache.json");

export interface LeaderboardEntry {
  rank: number;
  name: string;
  address: string;
  wins: number;
  clout: number;
  trend: "up" | "down" | "stable";
}

export const getLeaderboardCache = (): LeaderboardEntry[] => {
  if (!fs.existsSync(CACHE_PATH)) {
    return [];
  }
  try {
    const data = fs.readFileSync(CACHE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading leaderboard cache:", error);
    return [];
  }
};

export const updateLeaderboardCache = (entries: LeaderboardEntry[]) => {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(entries, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing leaderboard cache:", error);
  }
};
