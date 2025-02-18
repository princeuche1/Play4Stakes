import { create } from 'zustand';
import { User, Challenge, GameState } from '@/types/game';
import { supabase } from '@/lib/supabase';

interface GameStore extends GameState {
  setChallenge: (challenge: Challenge) => void;
  setCurrentUser: (user: User | null) => void;
  setGameActive: (challengeId: string) => void;
  finishGame: (userId: string, time: number) => void;
  processGameResult: (challengeId: string) => void;
  deductTokens: (amount: number) => void;
  createUser: (username: string) => Promise<User>;
}

const useGameStore = create<GameStore>((set, get) => ({
  challenge: null,
  currentUser: null,

  createUser: async (username: string) => {
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ username }])
      .select()
      .single();

    if (error) throw error;
    set({ currentUser: user });
    return user;
  },

  setChallenge: (challenge) => set({ challenge }),
  
  setCurrentUser: (user) => set({ currentUser: user }),

  setGameActive: async (challengeId) => {
    try {
      const { data: challenge, error } = await supabase
        .from('challenges')
        .update({ status: 'active' })
        .eq('id', challengeId)
        .select()
        .single();

      if (error) throw error;
      set({ challenge });
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  },

  finishGame: async (userId: string, time: number) => {
    const { challenge } = get();
    if (!challenge) return;

    try {
      const isHost = userId === challenge.hostId;
      const timeField = isHost ? 'host_time' : 'challenger_time';

      // Update player's time
      const { error: playerError } = await supabase
        .from('challenge_players')
        .update({ time })
        .eq('challenge_id', challenge.id)
        .eq('user_id', userId);

      if (playerError) throw playerError;

      // Get both players' times
      const { data: players, error: timesError } = await supabase
        .from('challenge_players')
        .select('user_id, time')
        .eq('challenge_id', challenge.id);

      if (timesError) throw timesError;

      // If both players have finished, determine winner
      if (players.every(p => p.time !== null)) {
        const hostPlayer = players.find(p => p.user_id === challenge.hostId);
        const challengerPlayer = players.find(p => p.user_id !== challenge.hostId);

        const winnerId = hostPlayer!.time! < challengerPlayer!.time! 
          ? hostPlayer!.user_id 
          : challengerPlayer!.user_id;

        // Update challenge status and create game result
        const { data: updatedChallenge, error: updateError } = await supabase
          .from('challenges')
          .update({ 
            status: 'completed',
          })
          .eq('id', challenge.id)
          .select()
          .single();

        if (updateError) throw updateError;

        const { error: resultError } = await supabase
          .from('game_results')
          .insert([{
            challenge_id: challenge.id,
            winner_id: winnerId,
            host_time: hostPlayer!.time,
            challenger_time: challengerPlayer!.time,
            completed_at: new Date().toISOString()
          }]);

        if (resultError) throw resultError;
        set({ challenge: updatedChallenge });
      }
    } catch (error) {
      console.error('Failed to update game results:', error);
      throw error;
    }
  },

  processGameResult: async (challengeId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      const { data: result, error } = await supabase
        .from('game_results')
        .select('winner_id, challenges(stake)')
        .eq('challenge_id', challengeId)
        .single();

      if (error) throw error;

      if (result.winner_id === currentUser.id) {
        const winnings = result.challenges.stake * 2;
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            tokens: currentUser.tokens + winnings 
          })
          .eq('id', currentUser.id);

        if (updateError) throw updateError;

        set(state => ({
          currentUser: {
            ...state.currentUser!,
            tokens: state.currentUser!.tokens + winnings
          }
        }));
      }
    } catch (error) {
      console.error('Failed to process game result:', error);
    }
  },

  deductTokens: async (amount: number) => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          tokens: currentUser.tokens - amount 
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      set(state => ({
        currentUser: {
          ...state.currentUser!,
          tokens: state.currentUser!.tokens - amount
        }
      }));
    } catch (error) {
      console.error('Failed to deduct tokens:', error);
    }
  }
}));

export default useGameStore; 