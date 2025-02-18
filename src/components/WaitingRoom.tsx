'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGameStore from '@/store/gameStore';

interface WaitingRoomProps {
  challengeId: string;
}

export default function WaitingRoom({ challengeId }: WaitingRoomProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);
  const { challenge, setChallenge } = useGameStore();

  useEffect(() => {
    if (!challenge) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Listen for opponent joining
    const checkOpponent = setInterval(async () => {
      const response = await fetch(`/api/challenges/${challengeId}`);
      const updatedChallenge = await response.json();
      
      if (updatedChallenge.status === 'active') {
        clearInterval(checkOpponent);
        clearInterval(timer);
        setChallenge(updatedChallenge);
        router.push(`/game/${challengeId}`);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(checkOpponent);
    };
  }, [challengeId, challenge, router, setChallenge]);

  // Handle challenge expiration
  useEffect(() => {
    if (expired) {
      // Show expiration message for 3 seconds before redirecting
      const redirectTimer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [expired, router]);

  const copyGameId = async () => {
    await navigator.clipboard.writeText(challengeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (expired) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Challenge was not accepted
        </h2>
        <p className="text-gray-600">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

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