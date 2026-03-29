import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'arena.json');

export interface Performer {
  id: string;
  name: string;
  avatar?: string;
  videoUrl: string;
  votes: number;
}

export interface Battle {
  id: string;
  performerA: Performer;
  performerB: Performer;
  timeLeft: number;
  status: 'active' | 'completed';
  winnerId?: string;
}

export async function getActiveBattle(): Promise<Battle> {
  try {
    if (!fs.existsSync(path.dirname(CACHE_FILE))) {
      fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    }

    if (!fs.existsSync(CACHE_FILE)) {
      const initialBattle: Battle = {
        id: "battle_101",
        performerA: {
          id: "perf_1",
          name: "FlowMaster.btc",
          videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          votes: 120,
        },
        performerB: {
          id: "perf_2",
          name: "LyricLover.stx",
          videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          votes: 145,
        },
        timeLeft: 180,
        status: 'active'
      };
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ activeBattle: initialBattle }, null, 2));
      return initialBattle;
    }

    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    return data.activeBattle;
  } catch (error) {
    console.error("Error reading arena cache:", error);
    throw error;
  }
}

export async function submitVote(battleId: string, performerId: string): Promise<Battle> {
  const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  const battle = data.activeBattle;

  if (battle.id !== battleId) throw new Error("Invalid battle ID");
  if (battle.status !== 'active') throw new Error("Battle is not active");

  if (battle.performerA.id === performerId) {
    battle.performerA.votes += 1;
  } else if (battle.performerB.id === performerId) {
    battle.performerB.votes += 1;
  } else {
    throw new Error("Invalid performer ID");
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify({ activeBattle: battle }, null, 2));
  return battle;
}
