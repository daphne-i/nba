import { Game, Team, Player, DraftPick } from './types';

export const THEME = {
  colors: {
    bg: '#0F1115', // Slightly richer black/grey
    card: '#181A20',
    border: '#262930', // Softer border
    accent: '#3B82F6', // Modern Blue
    accentHover: '#2563EB',
    success: '#10B981', // Emerald
    danger: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber
    text: '#F3F4F6', // Gray 100
    muted: '#9CA3AF', // Gray 400
    white: '#FFFFFF',
    black: '#000000',
  },
  fonts: {
    sans: "'Inter', sans-serif",
    mono: "'Inter', sans-serif", // Mapping mono to sans to force modern look if used
    display: "'Oswald', sans-serif",
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  }
};

export const TEAMS: Record<string, Team> = {
  LAL: { 
    id: 'LAL', 
    name: 'Los Angeles Lakers', 
    location: 'Los Angeles',
    nickname: 'Lakers',
    abbr: 'LAL', 
    color: '#552583', 
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    wins: 24, 
    losses: 23, 
    conference: 'West', 
    rank: 9 
  },
  BOS: { 
    id: 'BOS', 
    name: 'Boston Celtics', 
    location: 'Boston',
    nickname: 'Celtics',
    abbr: 'BOS', 
    color: '#007A33', 
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    wins: 35, 
    losses: 10, 
    conference: 'East', 
    rank: 1 
  },
  GSW: { 
    id: 'GSW', 
    name: 'Golden State Warriors', 
    location: 'Golden State',
    nickname: 'Warriors',
    abbr: 'GSW', 
    color: '#1D428A', 
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
    wins: 19, 
    losses: 24, 
    conference: 'West', 
    rank: 12 
  },
  DEN: { 
    id: 'DEN', 
    name: 'Denver Nuggets', 
    location: 'Denver',
    nickname: 'Nuggets',
    abbr: 'DEN', 
    color: '#0E2240', 
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
    wins: 31, 
    losses: 15, 
    conference: 'West', 
    rank: 3 
  },
  NYK: { 
    id: 'NYK', 
    name: 'New York Knicks', 
    location: 'New York',
    nickname: 'Knicks',
    abbr: 'NYK', 
    color: '#F58426', 
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
    wins: 29, 
    losses: 17, 
    conference: 'East', 
    rank: 4 
  },
  MIA: { 
    id: 'MIA', 
    name: 'Miami Heat', 
    location: 'Miami',
    nickname: 'Heat',
    abbr: 'MIA', 
    color: '#98002E', 
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
    wins: 24, 
    losses: 23, 
    conference: 'East', 
    rank: 7 
  },
};

export const MOCK_SCHEDULE: Game[] = [
  {
    id: 'g1',
    homeTeam: TEAMS.LAL,
    awayTeam: TEAMS.BOS,
    date: '2023-12-25T22:00:00Z',
    time: '5:00 PM ET',
    isNationalTv: true,
    broadcaster: 'ABC',
    status: 'FINAL',
    homeScore: 115,
    awayScore: 126
  },
  {
    id: 'g2',
    homeTeam: TEAMS.DEN,
    awayTeam: TEAMS.GSW,
    date: '2023-12-25T19:30:00Z',
    time: '2:30 PM ET',
    isNationalTv: true,
    broadcaster: 'ABC',
    status: 'FINAL',
    homeScore: 120,
    awayScore: 114
  },
  {
    id: 'g3',
    homeTeam: TEAMS.NYK,
    awayTeam: TEAMS.MIA,
    date: '2023-12-28T00:30:00Z',
    time: '7:30 PM ET',
    isNationalTv: false,
    broadcaster: 'League Pass',
    status: 'SCHEDULED'
  },
  {
    id: 'g4',
    homeTeam: TEAMS.LAL,
    awayTeam: TEAMS.GSW,
    date: '2024-01-28T01:30:00Z',
    time: '8:30 PM ET',
    isNationalTv: true,
    broadcaster: 'ABC',
    status: 'SCHEDULED'
  },
  {
    id: 'g5',
    homeTeam: TEAMS.BOS,
    awayTeam: TEAMS.NYK,
    date: '2023-11-14T00:30:00Z',
    time: '7:30 PM ET',
    isNationalTv: true,
    broadcaster: 'ESPN',
    status: 'FINAL',
    homeScore: 114,
    awayScore: 98
  }
];

export const MOCK_ROSTER: Player[] = [
  {
    id: 'p1',
    name: 'LeBron James',
    teamId: 'LAL',
    position: 'SF',
    headshotUrl: 'https://a.espncdn.com/i/headshots/nba/players/full/1966.png',
    weight: '250 lbs',
    age: 39,
    injuryStatus: { status: 'QUESTIONABLE', detail: 'Ankle', returnDate: 'Day-to-day' },
    stats: { season: { ppg: 24.8, rpg: 7.2, apg: 7.4, efg: 58.2, ts: 61.5, usg: 29.4, per: 22.5 }, last10: { ppg: 26.5, rpg: 8.1, apg: 9.0, efg: 60.1, ts: 64.2, usg: 31.0, per: 24.1 } },
    contract: { playerId: 'p1', playerName: 'LeBron James', years: [], totalValue: 99, expiryYear: 2025 }
  },
  {
    id: 'p2',
    name: 'Anthony Davis',
    teamId: 'LAL',
    position: 'C',
    headshotUrl: 'https://a.espncdn.com/i/headshots/nba/players/full/6583.png',
    weight: '253 lbs',
    age: 30,
    stats: { season: { ppg: 25.2, rpg: 12.2, apg: 3.4, efg: 59.2, ts: 63.5, usg: 27.4, per: 27.5 }, last10: { ppg: 28.5, rpg: 13.1, apg: 4.0, efg: 61.1, ts: 65.2, usg: 29.0, per: 29.1 } },
    contract: { playerId: 'p2', playerName: 'Anthony Davis', years: [], totalValue: 186, expiryYear: 2028 }
  },
  {
    id: 'p3',
    name: 'Jayson Tatum',
    teamId: 'BOS',
    position: 'SF',
    headshotUrl: 'https://a.espncdn.com/i/headshots/nba/players/full/4065648.png',
    weight: '210 lbs',
    age: 25,
    stats: { season: { ppg: 27.1, rpg: 8.6, apg: 4.8, efg: 55.4, ts: 60.1, usg: 29.8, per: 23.4 }, last10: { ppg: 28.2, rpg: 8.4, apg: 5.2, efg: 57.0, ts: 62.3, usg: 30.5, per: 24.8 } },
    contract: { playerId: 'p3', playerName: 'Jayson Tatum', years: [], totalValue: 304, expiryYear: 2029 }
  },
  {
    id: 'p4',
    name: 'Jaylen Brown',
    teamId: 'BOS',
    position: 'SG',
    headshotUrl: 'https://a.espncdn.com/i/headshots/nba/players/full/3917376.png',
    weight: '223 lbs',
    age: 27,
    stats: { season: { ppg: 22.8, rpg: 5.2, apg: 3.6, efg: 54.2, ts: 58.0, usg: 28.0, per: 19.5 }, last10: { ppg: 21.0, rpg: 5.0, apg: 3.2, efg: 52.0, ts: 56.5, usg: 27.5, per: 18.2 } },
    contract: { playerId: 'p4', playerName: 'Jaylen Brown', years: [], totalValue: 286, expiryYear: 2028 }
  },
   {
    id: 'p5',
    name: 'Stephen Curry',
    teamId: 'GSW',
    position: 'PG',
    headshotUrl: 'https://a.espncdn.com/i/headshots/nba/players/full/3975.png',
    weight: '185 lbs',
    age: 35,
    stats: { season: { ppg: 28.0, rpg: 4.4, apg: 5.0, efg: 60.0, ts: 66.0, usg: 31.0, per: 24.0 }, last10: { ppg: 30.0, rpg: 5.0, apg: 6.0, efg: 62.0, ts: 68.0, usg: 32.0, per: 26.0 } },
    contract: { playerId: 'p5', playerName: 'Stephen Curry', years: [], totalValue: 215, expiryYear: 2026 }
  }
];

export const MOCK_PICKS: DraftPick[] = [
  { year: 2024, round: 1, originalOwner: 'NOP', status: 'OWED', condition: 'Unprotected -> NOP' },
  { year: 2024, round: 2, originalOwner: 'LAC', status: 'OWNED' },
  { year: 2025, round: 1, originalOwner: 'LAL', status: 'OWNED' },
  { year: 2026, round: 1, originalOwner: 'LAL', status: 'SWAP', condition: 'Swap w/ CLE' },
  { year: 2027, round: 1, originalOwner: 'LAL', status: 'OWNED', condition: 'Top-4 Protected' },
];

export const MOCK_SALARY_CAP_DATA = [
  { name: '2023-24', Guaranteed: 165, Options: 15, CapSpace: 0 },
  { name: '2024-25', Guaranteed: 110, Options: 55, CapSpace: 12 },
  { name: '2025-26', Guaranteed: 85, Options: 0, CapSpace: 45 },
];

export const MOCK_PLAYER: Player = MOCK_ROSTER[0];