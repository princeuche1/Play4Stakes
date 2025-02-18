'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';
import PreGameLobby from '@/components/PreGameLobby';
import FiveNumbersGame from '@/components/FiveNumbersGame';
import GameResults from '@/components/GameResults';

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { challenge, currentUser } = useGameStore();

  const handleFinish = (time: number) => {
    const { finishGame } = useGameStore.getState();
    finishGame(currentUser.id, time);
  };

  if (!challenge || !currentUser) {
    router.push('/dashboard');
    return null;
  }

  if (challenge.status === 'completed') {
    return <GameResults challengeId={resolvedParams.id} />;
  }

  if (challenge.status === 'waiting') {
    return <PreGameLobby challengeId={resolvedParams.id} />;
  }

  return <FiveNumbersGame onFinish={handleFinish} />;
} 