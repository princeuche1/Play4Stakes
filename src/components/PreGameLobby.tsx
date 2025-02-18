'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';
import { supabase } from '@/lib/supabase';

interface PreGameLobbyProps {
  challengeId: string;
}

export default function PreGameLobby({ challengeId }: PreGameLobbyProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [copied, setCopied] = useState(false);
  const { challenge, setChallenge } = useGameStore();

  useEffect(() => {
    if (!challenge) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Subscribe to challenge updates
    const subscription = supabase
      .channel(`challenge_${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'challenges',
          filter: `id=eq.${challengeId}`
        },
        async (payload) => {
          if (payload.new.status === 'active') {
            const { data: updatedChallenge } = await supabase
              .from('challenges')
              .select(`
                *,
                players:challenge_players(user_id, role),
                host:users!challenges_host_id_fkey(username)
              `)
              .eq('id', challengeId)
              .single();

            if (updatedChallenge) {
              setChallenge(updatedChallenge);
              router.push(`/game/${challengeId}`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, [challengeId, challenge, router, setChallenge]);

  const copyGameId = async () => {
    await navigator.clipboard.writeText(challengeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-6">Waiting for Opponent</h2>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-2">Share this game ID with your opponent:</p>
        <div className="flex items-center justify-center gap-2">
          <code className="px-4 py-2 bg-gray-100 rounded-lg">{challengeId}</code>
          <button
            onClick={copyGameId}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xl font-semibold">Time remaining:</p>
        <p className="text-3xl font-mono text-indigo-600">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </p>
      </div>

      <p className="text-gray-600">
        Challenge will expire if no one joins within the time limit
      </p>
    </div>
  );
} 