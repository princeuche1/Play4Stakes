'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';
import { AVAILABLE_GAMES } from '@/config/games';
import GameCard from '@/components/GameCard';
import TopUpModal from '@/components/TopUpModal';

export default function Dashboard() {
  const router = useRouter();
  const { currentUser } = useGameStore();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-12">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {currentUser.username}!</h2>
            <p className="text-gray-600">Current Balance: {currentUser.tokens} tokens</p>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Top Up Tokens
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Available Games</h2>
            <p className="text-gray-600">Choose a game and challenge other players</p>
          </div>
          <div className="text-sm text-gray-500">
            {AVAILABLE_GAMES.length} games available
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {AVAILABLE_GAMES.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
      />
    </div>
  );
} 