'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinGameModal({ isOpen, onClose }: JoinGameModalProps) {
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { currentUser } = useGameStore();

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/games?id=${gameId}`);
      if (!response.ok) {
        throw new Error('Game not found');
      }

      const challenge = await response.json();
      
      if (challenge.status !== 'waiting') {
        throw new Error('This game is no longer available');
      }

      if (challenge.stake > currentUser.tokens) {
        throw new Error(`Insufficient tokens. This game requires ${challenge.stake} tokens`);
      }

      // Join the game through the API
      const joinResponse = await fetch(`/api/games?id=${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'active',
          players: {
            ...challenge.players,
            challenger: currentUser,
          },
        }),
      });

      if (!joinResponse.ok) {
        throw new Error('Failed to join game');
      }

      router.push(`/game/${gameId}`);
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to join game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Join Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gameId" className="block text-sm font-medium text-gray-700">
              Game ID
            </label>
            <input
              type="text"
              id="gameId"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 