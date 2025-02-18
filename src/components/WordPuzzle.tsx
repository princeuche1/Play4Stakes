'use client';

import { useEffect, useState } from 'react';

interface WordPuzzleProps {
  onFinish: (time: number) => void;
}

const WORDS = [
  'REACT',
  'TYPESCRIPT',
  'NEXTJS',
  'JAVASCRIPT',
  'PROGRAMMING',
  'DEVELOPER',
  'FRONTEND',
  'BACKEND',
  'FULLSTACK',
  'DATABASE',
];

export default function WordPuzzle({ onFinish }: WordPuzzleProps) {
  const [word, setWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Pick a random word and scramble it
    const selectedWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const scrambled = selectedWord
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    
    setWord(selectedWord);
    setScrambledWord(scrambled);
    setStartTime(performance.now());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.toUpperCase() === word) {
      const endTime = performance.now();
      if (startTime) {
        const timeElapsed = (endTime - startTime) / 1000; // Convert to seconds
        onFinish(Number(timeElapsed.toFixed(5)));
      }
    } else {
      setAttempts(prev => prev + 1);
      setUserInput('');
      alert('Incorrect! Try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Unscramble the Word</h3>
        <div className="text-3xl font-bold tracking-wider text-indigo-600 mb-2">
          {scrambledWord}
        </div>
        <p className="text-sm text-gray-600">
          Attempts: {attempts}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 text-center text-xl border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type your answer"
            autoFocus
            autoComplete="off"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Submit Answer
        </button>
      </form>

      <div className="text-sm text-gray-600 text-center">
        <p>Hint: It&apos;s a programming-related word</p>
      </div>
    </div>
  );
} 