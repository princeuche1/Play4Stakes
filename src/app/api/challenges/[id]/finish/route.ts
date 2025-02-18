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

    const updatedChallenge = await request.json();
    
    // Validate the update
    if (!updatedChallenge.results) {
      return NextResponse.json(
        { error: 'Invalid game results' },
        { status: 400 }
      );
    }

    // Update the challenge in our store
    challenges.set(params.id, updatedChallenge);
    console.log('Updated challenge results:', updatedChallenge);

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error('Update game results error:', error);
    return NextResponse.json(
      { error: 'Failed to update game results' },
      { status: 500 }
    );
  }
} 