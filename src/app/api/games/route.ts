import { NextResponse } from 'next/server';
import type { Challenge } from '@/types/game';

// In-memory store for challenges (replace with database in production)
const challenges = new Map<string, Challenge>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
  }

  const challenge = challenges.get(id);
  if (!challenge) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  return NextResponse.json(challenge);
}

export async function POST(request: Request) {
  const challenge = await request.json();

  if (!challenge.id || !challenge.hostId) {
    return NextResponse.json({ error: 'Invalid challenge data' }, { status: 400 });
  }

  challenges.set(challenge.id, challenge);
  
  // Set expiration timer
  setTimeout(() => {
    const storedChallenge = challenges.get(challenge.id);
    if (storedChallenge?.status === 'waiting') {
      challenges.delete(challenge.id);
    }
  }, 5 * 60 * 1000); // 5 minutes

  return NextResponse.json(challenge);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const updates = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
  }

  const challenge = challenges.get(id);
  if (!challenge) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  const updatedChallenge = {
    ...challenge,
    ...updates,
  };

  challenges.set(id, updatedChallenge);
  return NextResponse.json(updatedChallenge);
} 