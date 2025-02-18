'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';
import { GameInfo } from '@/types/game';
import { supabase } from '@/lib/supabase';

interface ChallengeCreatorProps {
  game: GameInfo;
}

const MIN_STAKE = 20;

export default function ChallengeCreator({ game }: ChallengeCreatorProps) {
  const router = useRouter();
  const { currentUser, setChallenge, deductTokens } = useGameStore();
  const [stake, setStake] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStake(value);
    
    if (!value) {
      setError('Stake amount is required');
      return;
    }

    const stakeAmount = Number(value);
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      setError('Invalid stake amount');
      return;
    }

    if (stakeAmount < MIN_STAKE) {
      setError(`Minimum stake is ${MIN_STAKE} tokens`);
      return;
    }

    if (currentUser && stakeAmount > currentUser.tokens) {
      setError('Insufficient balance');
      return;
    }

    setError('');
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isCreating || error) return;

    const stakeAmount = Number(stake);
    setIsCreating(true);

    try {
      // Create the challenge
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .insert([{
          host_id: currentUser.id,
          game_type: game.id,
          stake: stakeAmount,
        }])
        .select()
        .single();

      if (challengeError) throw challengeError;

      // Create the host player record
      const { error: playerError } = await supabase
        .from('challenge_players')
        .insert([{
          challenge_id: challenge.id,
          user_id: currentUser.id,
          role: 'host'
        }]);

      if (playerError) throw playerError;

      // Deduct tokens from host
      await deductTokens(stakeAmount);

      setChallenge(challenge);
      router.push(`/challenge/${challenge.id}/waiting`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!currentUser) {
    router.push('/');
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Challenge</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Your Balance: {currentUser.tokens} tokens</p>
      </div>

      <form onSubmit={handleCreateChallenge}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Stake Amount</label>
          <input
            type="number"
            value={stake}
            onChange={handleStakeChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder={`Minimum ${MIN_STAKE} tokens`}
            min={MIN_STAKE}
            max={currentUser.tokens}
            required
            disabled={isCreating}
          />
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!!error || isCreating || !stake}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Challenge'}
        </button>
      </form>
    </div>
  );
} 