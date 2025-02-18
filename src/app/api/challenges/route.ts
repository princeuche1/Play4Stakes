import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Challenge } from '@/types/game';
import { challenges } from '@/lib/challengeStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stake, gameType, currentUser } = body;

    if (!currentUser || !stake || !gameType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const challenge: Challenge = {
      id: uuidv4(),
      hostId: currentUser.id,
      gameType,
      stake,
      createdAt: Date.now(),
      status: 'waiting',
      players: {
        host: currentUser,
      },
      results: {}
    };

    challenges.set(challenge.id, challenge);
    console.log('Challenge created:', challenge);

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Challenge creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
} 