import { NextResponse } from 'next/server';
import { challenges } from '@/lib/challengeStore';

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

    if (challenge.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Challenge is no longer available' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { currentUser } = body;

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 400 }
      );
    }

    if (currentUser.id === challenge.hostId) {
      return NextResponse.json(
        { error: 'Cannot join your own challenge' },
        { status: 400 }
      );
    }

    // Update challenge with challenger
    challenge.status = 'active';
    challenge.players = {
      ...challenge.players,
      challenger: currentUser
    };
    challenges.set(params.id, challenge);

    console.log('Challenge joined:', challenge);

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Join challenge error:', error);
    return NextResponse.json(
      { error: 'Failed to join challenge' },
      { status: 500 }
    );
  }
} 