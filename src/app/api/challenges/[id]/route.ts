import { NextResponse } from 'next/server';
import { challenges } from '@/lib/challengeStore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = challenges.get(params.id);
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = challenges.get(params.id);
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { user } = body;

    // Update challenge with challenger
    challenge.status = 'active';
    challenge.players.challenger = user;
    challenges.set(params.id, challenge);

    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to join challenge' },
      { status: 500 }
    );
  }
} 