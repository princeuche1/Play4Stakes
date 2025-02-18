'use client';

import { use } from 'react';
import ChallengeJoiner from '@/components/ChallengeJoiner';
import { AVAILABLE_GAMES } from '@/config/games';

export default function JoinChallenge({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const game = AVAILABLE_GAMES.find(g => g.id === resolvedParams.id);

  if (!game) return null;

  return <ChallengeJoiner game={game} />;
} 