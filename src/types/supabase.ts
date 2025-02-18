export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          tokens: number
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          username: string
          tokens?: number
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          username?: string
          tokens?: number
          created_at?: string
          last_login?: string | null
        }
      }
      challenges: {
        Row: {
          id: string
          host_id: string
          game_type: string
          stake: number
          status: 'waiting' | 'active' | 'completed'
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          host_id: string
          game_type: string
          stake: number
          status?: 'waiting' | 'active' | 'completed'
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          game_type?: string
          stake?: number
          status?: 'waiting' | 'active' | 'completed'
          created_at?: string
          expires_at?: string
        }
      }
      challenge_players: {
        Row: {
          challenge_id: string
          user_id: string
          role: 'host' | 'challenger'
          time: number | null
          joined_at: string
        }
        Insert: {
          challenge_id: string
          user_id: string
          role: 'host' | 'challenger'
          time?: number | null
          joined_at?: string
        }
        Update: {
          challenge_id?: string
          user_id?: string
          role?: 'host' | 'challenger'
          time?: number | null
          joined_at?: string
        }
      }
      game_results: {
        Row: {
          id: string
          challenge_id: string
          winner_id: string | null
          host_time: number | null
          challenger_time: number | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          challenge_id: string
          winner_id?: string | null
          host_time?: number | null
          challenger_time?: number | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          challenge_id?: string
          winner_id?: string | null
          host_time?: number | null
          challenger_time?: number | null
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 