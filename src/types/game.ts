export interface User {
  id: string;
  username: string;
  tokens: number;
}

export interface Challenge {
  id: string;
  hostId: string;
  gameType: string;
  stake: number;
  createdAt: number;
  status: 'waiting' | 'active' | 'completed' | 'expired';
  players: {
    host: User;
    challenger?: User;
  };
  results?: {
    hostTime?: number;
    challengerTime?: number;
    winnerId?: string;
  };
}

export interface GameState {
  challenge: Challenge | null;
  currentUser: User | null;
}

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  rules: string[];
  image: string; // URL to game icon/image
  minStake: number;
} 