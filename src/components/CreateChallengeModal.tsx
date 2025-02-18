'use client';

import { useState } from 'react';
import useGameStore from '@/store/gameStore';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (stake: number) => void;
  isCreating: boolean;
}

export default function CreateChallengeModal({ 
  isOpen, 
  onClose, 
  onCreateChallenge,
  isCreating 
}: CreateChallengeModalProps) {
  const [stake, setStake] = useState('100');
  const { currentUser } = useGameStore();

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stakeAmount = parseInt(stake, 10);
    
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      alert('Please enter a valid stake amount');
      return;
    }

    if (stakeAmount > currentUser.tokens) {
      alert('Insufficient tokens for this stake amount');
      return;
    }

    onCreateChallenge(stakeAmount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Challenge</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stake" className="block text-sm font-medium text-gray-700">
              Stake Amount (Your balance: {currentUser.tokens} tokens)
            </label>
            <input
              type="number"
              id="stake"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              min="1"
              max={currentUser.tokens}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 