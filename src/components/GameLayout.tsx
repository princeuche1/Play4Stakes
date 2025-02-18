'use client';

import { useState, useEffect, useCallback } from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
  isComplete: boolean;
  onComplete: (time: number) => void;
  showTimer: boolean;
}

export default function GameLayout({ children, isComplete, onComplete, showTimer }: GameLayoutProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize timer when showTimer becomes true
  useEffect(() => {
    if (showTimer && !startTime) {
      setStartTime(Date.now());
    }
  }, [showTimer, startTime]);

  const updateTimer = useCallback(() => {
    if (!startTime) return;
    const currentTime = (Date.now() - startTime) / 1000;
    setElapsedTime(Number(currentTime.toFixed(5)));
  }, [startTime]);

  useEffect(() => {
    if (isFinished || !startTime) return;

    const timer = setInterval(updateTimer, 10);
    return () => clearInterval(timer);
  }, [updateTimer, isFinished, startTime]);

  useEffect(() => {
    if (isComplete && !isFinished && startTime) {
      setIsFinished(true);
      onComplete(elapsedTime);
    }
  }, [isComplete, isFinished, elapsedTime, onComplete, startTime]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Timer */}
      {showTimer && (
        <div className={`fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 font-mono text-xl ${
          isFinished ? 'bg-green-100' : ''
        }`}>
          {isFinished ? (
            <span className="text-green-600">Finished: {elapsedTime.toFixed(5)}s</span>
          ) : (
            <span>{elapsedTime.toFixed(5)}s</span>
          )}
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 