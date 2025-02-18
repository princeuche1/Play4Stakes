'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import useGameStore from '@/store/gameStore';

interface FiveNumbersGameProps {
  challengeId: string;
}

export default function FiveNumbersGame({ challengeId }: FiveNumbersGameProps) {
  const { currentUser } = useGameStore();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [targetNumbers, setTargetNumbers] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState('');

  // Generate random numbers for the grid
  useEffect(() => {
    const nums = Array.from({ length: 50 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setNumbers(nums);
    
    // Generate 5 target numbers
    const targets = nums.slice(0, 5).sort((a, b) => a - b);
    setTargetNumbers(targets);
    setStartTime(Date.now());
  }, []);

  const handleNumberClick = useCallback(async (number: number) => {
    if (isFinished || !currentUser || !startTime) return;

    if (targetNumbers.includes(number) && !selectedNumbers.includes(number)) {
      const newSelected = [...selectedNumbers, number];
      setSelectedNumbers(newSelected);

      // Check if all numbers are found
      if (newSelected.length === targetNumbers.length) {
        setIsFinished(true);
        const endTime = Date.now();
        const timeInSeconds = (endTime - startTime) / 1000;

        try {
          // Update player's time
          const { error: timeError } = await supabase
            .from('challenge_players')
            .update({ time: timeInSeconds })
            .eq('challenge_id', challengeId)
            .eq('user_id', currentUser.id);

          if (timeError) throw timeError;

          // Check if both players have finished
          const { data: players, error: playersError } = await supabase
            .from('challenge_players')
            .select('user_id, time')
            .eq('challenge_id', challengeId);

          if (playersError) throw playersError;

          if (players.every(p => p.time !== null)) {
            // Get challenge details to determine winner
            const { data: challenge, error: challengeError } = await supabase
              .from('challenges')
              .select('*')
              .eq('id', challengeId)
              .single();

            if (challengeError) throw challengeError;

            const hostPlayer = players.find(p => p.user_id === challenge.host_id);
            const challengerPlayer = players.find(p => p.user_id !== challenge.host_id);

            const winnerId = hostPlayer!.time! < challengerPlayer!.time! 
              ? hostPlayer!.user_id 
              : challengerPlayer!.user_id;

            // Update challenge status and create game result
            await supabase
              .from('challenges')
              .update({ status: 'completed' })
              .eq('id', challengeId);

            await supabase
              .from('game_results')
              .insert([{
                challenge_id: challengeId,
                winner_id: winnerId,
                host_time: hostPlayer!.time,
                challenger_time: challengerPlayer!.time,
                completed_at: new Date().toISOString()
              }]);
          }
        } catch (err) {
          setError('Failed to update game results');
          console.error('Game completion error:', err);
        }
      }
    }
  }, [challengeId, currentUser, isFinished, selectedNumbers, startTime, targetNumbers]);

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Find these numbers:</h2>
        <div className="flex justify-center gap-4">
          {targetNumbers.map(num => (
            <div
              key={num}
              className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl font-bold
                ${selectedNumbers.includes(num)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
                }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      <div className="grid grid-cols-10 gap-2">
        {numbers.map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={isFinished}
            className={`w-12 h-12 rounded-lg text-xl font-bold transition-colors
              ${selectedNumbers.includes(num)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
              } disabled:cursor-not-allowed`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
} 