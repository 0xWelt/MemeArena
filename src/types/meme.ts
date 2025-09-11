export interface Meme {
  id: number;
  name: string;
  cover: string;
  description?: string;
  elo_score: number;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
}

export interface ApiMeme {
  id: number;
  name: string;
  cover: string;
  description?: string;
  elo_score: number;
  wins: number;
  losses: number;
}

export interface Battle {
  id: number;
  meme1_id: number;
  meme2_id: number;
  winner_id: number;
  created_at: string;
}

export interface BattleResult {
  meme1_id: number;
  meme2_id: number;
  winner_id: number;
}