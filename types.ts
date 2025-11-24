export enum ViewState {
  SCHEDULE = 'SCHEDULE',
  STANDINGS = 'STANDINGS',
  TEAM_DETAIL = 'TEAM_DETAIL',
}

export interface Team {
  id: string;
  name: string;
  abbr: string;
  location?: string; // e.g. "Los Angeles"
  nickname?: string; // e.g. "Lakers"
  color: string;
  logoUrl: string;
  wins: number;
  losses: number;
  conference: 'East' | 'West';
  rank: number;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string; // ISO string
  time: string;
  isNationalTv: boolean;
  broadcaster?: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINAL';
  homeScore?: number;
  awayScore?: number;
}

export interface SalaryYear {
  year: string;
  amount: number;
  type: 'GUARANTEED' | 'NON-GUARANTEED' | 'TEAM_OPTION' | 'PLAYER_OPTION';
}

export interface Contract {
  playerId: string;
  playerName: string;
  years: SalaryYear[];
  totalValue: number;
  expiryYear: number;
}

export interface DraftPick {
  year: number;
  round: 1 | 2;
  originalOwner: string;
  condition?: string; // e.g. "Top 4 Protected"
  status: 'OWNED' | 'OWED' | 'SWAP';
}

export interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
  efg: number; // Effective Field Goal %
  ts: number;  // True Shooting %
  usg: number; // Usage Rate %
  per: number; // Player Efficiency Rating
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  headshotUrl: string;
  position: string;
  weight: string;
  age: number;
  injuryStatus?: {
    status: 'OUT' | 'DOUBTFUL' | 'QUESTIONABLE';
    detail: string;
    returnDate: string;
  };
  stats: {
    season: PlayerStats;
    last10: PlayerStats;
  };
  contract: Contract;
}