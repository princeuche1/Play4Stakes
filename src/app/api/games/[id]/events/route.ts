import { NextResponse } from 'next/server';
import { Challenge } from '@/types/game';

// Store for active game event streams
const gameStreams = new Map<string, Set<ReadableStreamDefaultController>>();

export async function GET() {
  return new Response('Event stream connected');
}

// Helper function to broadcast updates to all connected clients
export function broadcastGameUpdate(gameId: string, challenge: Challenge) {
  const streams = gameStreams.get(gameId);
  if (!streams) return;

  const encoder = new TextEncoder();
  const data = encoder.encode(`data: ${JSON.stringify(challenge)}\n\n`);

  streams.forEach((controller) => {
    try {
      controller.enqueue(data);
    } catch (error) {
      console.error('Error broadcasting game update:', error);
    }
  });
} 