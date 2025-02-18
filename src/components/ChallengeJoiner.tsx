'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';
import { supabase } from '@/lib/supabase';
import { GameInfo } from '@/types/game';

interface ChallengeJoinerProps {
  game: GameInfo;
}

export default function ChallengeJoiner({ game }: ChallengeJoinerProps) {
  const router = useRouter();
  const { currentUser, setChallenge, deductTokens } = useGameStore();
  const [gameId, setGameId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [challengeDetails, setChallengeDetails] = useState<{
    stake: number;
    hostUsername: string;
  } | null>(null);

  useEffect(() => {
    if (!currentUser && shouldRedirect) {
      router.push('/');
    }
  }, [currentUser, router, shouldRedirect]);

  const handleGameIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setGameId(value);
    setError('');
    setChallengeDetails(null);

    if (value.length >= 6) {
      try {
        // Get challenge details
        const { data: challenge, error: challengeError } = await supabase
          .from('challenges')
          .select(`
            *,
            players:challenge_players(user_id, role),
            host:users!challenges_host_id_fkey(username)
          `)
          .eq('id', value)
          .single();

        if (challengeError) throw new Error('Invalid game ID');
        
        if (challenge.status !== 'waiting') {
          throw new Error('This game is no longer available');
        }

        if (challenge.host_id === currentUser?.id) {
          throw new Error('Cannot join your own challenge');
        }

        setChallengeDetails({
          stake: challenge.stake,
          hostUsername: challenge.host.username
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate game ID');
      }
    }
  };

  const handleJoinChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !challengeDetails || isJoining) return;

    if (currentUser.tokens < challengeDetails.stake) {
      setError('Insufficient tokens');
      return;
    }

    setIsJoining(true);

    try {
      // Start a transaction by deducting tokens first
      await deductTokens(challengeDetails.stake);

      // Add challenger to challenge_players
      const { error: playerError } = await supabase
        .from('challenge_players')
        .insert([{
          challenge_id: gameId,
          user_id: currentUser.id,
          role: 'challenger'
        }]);

      if (playerError) throw playerError;

      // Update challenge status
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .update({ status: 'active' })
        .eq('id', gameId)
        .select(`
          *,
          players:challenge_players(user_id, role),
          host:users!challenges_host_id_fkey(username)
        `)
        .single();

      if (challengeError) throw challengeError;

      setChallenge(challenge);
      router.push(`/game/${gameId}`);
    } catch (err) {
      // If anything fails, refund the tokens
      if (challengeDetails.stake) {
        await supabase
          .from('users')
          .update({ 
            tokens: currentUser.tokens + challengeDetails.stake 
          })
          .eq('id', currentUser.id);
      }
      setError(err instanceof Error ? err.message : 'Failed to join challenge. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  if (!currentUser) {
    setShouldRedirect(true);
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Join Challenge</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Your Balance: {currentUser.tokens} tokens</p>
      </div>

      <form onSubmit={handleJoinChallenge}>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Game ID</label>
          <input
            type="text"
            value={gameId}
            onChange={handleGameIdChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter game ID"
            required
            disabled={isJoining}
          />
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </div>

        {challengeDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Challenge Details</h3>
            <p className="text-gray-600">Host: {challengeDetails.hostUsername}</p>
            <p className="text-gray-600">Stake: {challengeDetails.stake} tokens</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!challengeDetails || isJoining || !!error}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining ? 'Joining...' : 'Join Challenge'}
        </button>
      </form>
    </div>
  );
} 