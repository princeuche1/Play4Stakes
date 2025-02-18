import { useEffect, useState } from 'react';
import useGameStore from '@/store/gameStore';
import { Challenge } from '@/types/game';

export function useGameState(gameId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { challenge, setChallenge, currentUser, joinChallenge } = useGameStore();

  useEffect(() => {
    let eventSource: EventSource;

    async function initializeGame() {
      try {
        // Fetch initial game state
        const response = await fetch(`/api/games?id=${gameId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game');
        }
        
        const gameData: Challenge = await response.json();
        setChallenge(gameData);
        setLoading(false);

        // Set up SSE connection
        eventSource = new EventSource(`/api/games/${gameId}/events`);
        eventSource.onmessage = (event) => {
          const updatedGame: Challenge = JSON.parse(event.data);
          setChallenge(updatedGame);
        };

        eventSource.onerror = () => {
          setError('Lost connection to game server');
          eventSource.close();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    initializeGame();

    return () => {
      eventSource?.close();
    };
  }, [gameId, setChallenge]);

  const handleJoinGame = async () => {
    if (!currentUser || !challenge) return;

    try {
      const response = await fetch(`/api/games?id=${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'active',
          players: {
            ...challenge.players,
            challenger: currentUser,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join game');
      }

      joinChallenge(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    }
  };

  return {
    challenge,
    loading,
    error,
    handleJoinGame,
  };
} 