'use client';

import { use } from 'react';
import ChallengeCreator from '@/components/ChallengeCreator';
import { AVAILABLE_GAMES } from '@/config/games';

export default function CreateChallenge({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const game = AVAILABLE_GAMES.find(g => g.id === resolvedParams.id);

  if (!game) return null;

  return <ChallengeCreator game={game} />;
} 