'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_GAMES } from '@/config/games';
import Image from 'next/image';
import useGameStore from '@/store/gameStore';

export default function GameDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentUser } = useGameStore();
  if (!currentUser) return null;
  const game = AVAILABLE_GAMES.find(g => g.id === resolvedParams.id);

  if (!game) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
          <p className="text-gray-600 mb-6">{game.description}</p>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Game Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              {game.rules.map((rule, index) => (
                <li key={index} className="text-gray-600">{rule}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/games/${game.id}/create`)}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Create Challenge
            </button>
            <button
              onClick={() => router.push(`/games/${game.id}/join`)}
              className="flex-1 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50"
            >
              Join Existing Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 