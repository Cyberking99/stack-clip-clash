import { NextResponse } from 'next/server';
import { getActiveBattle, submitVote } from '@/lib/arena-cache';

export async function GET() {
  try {
    const battle = await getActiveBattle();
    return NextResponse.json(battle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch battle' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { battleId, performerId } = await request.json();
    const updatedBattle = await submitVote(battleId, performerId);
    return NextResponse.json(updatedBattle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
