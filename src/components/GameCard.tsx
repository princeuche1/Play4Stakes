'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GameInfo } from '@/types/game';

interface GameCardProps {
  game: GameInfo;
}

export default function GameCard({ game }: GameCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/games/${game.id}`)}
      className="group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
    >
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
          <p className="text-white/80 text-sm">
            Min. Stake: {game.minStake} tokens
          </p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-2">{game.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {game.rules.length} rules
          </span>
          <span className="text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Play Now →
          </span>
        </div>
      </div>
    </div>
  );
} 