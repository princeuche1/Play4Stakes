'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';
import { supabase } from '@/lib/supabase';

interface GameResultsProps {
  challengeId: string;
}

interface GameResult {
  winner_id: string;
  host_time: number;
  challenger_time: number;
  challenge: {
    stake: number;
    host: { username: string };
    challenger: { username: string };
  };
}

export default function GameResults({ challengeId }: GameResultsProps) {
  const router = useRouter();
  const { currentUser } = useGameStore();
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase
          .from('game_results')
          .select(`
            winner_id,
            host_time,
            challenger_time,
            challenge:challenges(
              stake,
              host:users!challenges_host_id_fkey(username),
              challenger:users(username)
            )
          `)
          .eq('challenge_id', challengeId)
          .single();

        if (error) throw error;
        setResult(data);
      } catch (err) {
        setError('Failed to load game results');
        console.error('Error fetching results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [challengeId]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error || !result || !currentUser) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="text-red-600">{error || 'Something went wrong'}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isWinner = result.winner_id === currentUser.id;
  const playerTime = currentUser.id === result.challenge.host.username
    ? result.host_time
    : result.challenger_time;
  const opponentTime = currentUser.id === result.challenge.host.username
    ? result.challenger_time
    : result.host_time;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold mb-6">
        {isWinner ? (
          <span className="text-green-600">You Won! 🎉</span>
        ) : (
          <span className="text-red-600">You Lost</span>
        )}
      </h2>

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-gray-600">Your Time</p>
          <p className="text-2xl font-mono">{playerTime?.toFixed(3)}s</p>
        </div>
        <div>
          <p className="text-gray-600">Opponent's Time</p>
          <p className="text-2xl font-mono">{opponentTime?.toFixed(3)}s</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <p className="text-lg font-semibold mb-2">
          {isWinner ? 'You won' : 'You lost'} {result.challenge.stake * 2} tokens
        </p>
        <p className="text-gray-600">
          {isWinner ? 'Tokens have been added to your wallet' : 'Better luck next time!'}
        </p>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        Return to Dashboard
      </button>
    </div>
  );
} 