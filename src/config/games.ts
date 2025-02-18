import { GameInfo } from '@/types/game';

export const AVAILABLE_GAMES: GameInfo[] = [
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Race against your opponent to unscramble programming words',
    rules: [
      'Both players get the same scrambled word',
      'First to unscramble it correctly wins',
      'No time limit, but faster time wins',
      'Winner takes 95% of the total pot'
    ],
    image: '/images/word-scramble.png', // You'll need to add this image
    minStake: 20
  },
  {
    id: 'word-chain',
    name: 'Code Chain',
    description: 'Create a chain of programming terms where each word starts with the last letter of the previous word',
    rules: [
      'First player enters any programming term',
      'Next player must enter a term starting with the last letter of previous word',
      'No word can be used twice',
      'First player who cannot continue loses',
      'Time limit: 15 seconds per turn'
    ],
    image: '/images/word-chain.png',
    minStake: 20
  },
  {
    id: 'missing-letters',
    name: 'Missing Letters',
    description: 'Fill in the missing letters in programming concepts and methods',
    rules: [
      'Words have random letters removed',
      'Both players get the same pattern',
      'Three wrong attempts and you lose',
      'Faster correct solution wins',
      'Category hints provided'
    ],
    image: '/images/missing-letters.png',
    minStake: 20
  },
  {
    id: 'syntax-sprint',
    name: 'Syntax Sprint',
    description: 'Race to fix syntax errors in code snippets before your opponent',
    rules: [
      'Code snippet contains syntax errors',
      'Find and fix all errors to win',
      'Both players get identical broken code',
      'First to fix all errors correctly wins',
      'Multiple programming languages available'
    ],
    image: '/images/syntax-sprint.png',
    minStake: 20
  },
  {
    id: 'five-numbers',
    name: '5 Numbers Sprint',
    description: 'Find and select 5 specific numbers from a grid of 50 numbers as quickly as possible.',
    image: '/images/five-numbers.jpg',
    minStake: 20,
    rules: [
      'You will be shown 5 target numbers',
      'Find and select these numbers from the grid',
      'Fastest player wins the pot'
    ]
  }
]; 