import { NextResponse } from 'next/server';
import { Challenge } from '@/types/game';

// Store for active game event streams
const gameStreams = new Map<string, Set<ReadableStreamDefaultController>>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;

  // Set up SSE headers
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Add this client's controller to the game's stream set
      if (!gameStreams.has(gameId)) {
        gameStreams.set(gameId, new Set());
      }
      gameStreams.get(gameId)?.add(controller);

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        gameStreams.get(gameId)?.delete(controller);
        if (gameStreams.get(gameId)?.size === 0) {
          gameStreams.delete(gameId);
        }
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
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