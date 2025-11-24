import { Team, Game, Player } from '../types';

// NOTE: The user requested "nba_api" (Python). Since this is a client-side React app, 
// we are using ESPN's public API as a proxy-free, reliable alternative to "stats.nba.com" 
// endpoints which have strict CORS policies preventing direct browser access.

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';
const CORE_API = 'https://site.api.espn.com/apis/v2/sports/basketball/nba';
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 Hours in milliseconds

const processTeamColor = (color?: string) => {
  if (!color) return '#1E1E1E';
  return color.startsWith('#') ? color : `#${color}`;
};

// --- Caching Helpers ---

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const getFromCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed: CacheEntry<T> = JSON.parse(item);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      // Cache is valid
      return parsed.data;
    }
    // Cache expired
    localStorage.removeItem(key);
    return null;
  } catch (e) {
    console.warn("Failed to parse cache for key:", key, e);
    return null;
  }
};

const saveToCache = <T>(key: string, data: T) => {
  try {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    console.warn("Failed to save to cache", e);
  }
};

// --- API Functions ---

export const fetchStandings = async (): Promise<Team[]> => {
  const CACHE_KEY = 'nba_standings_cache_v2'; // Incremented for new fields
  const cached = getFromCache<Team[]>(CACHE_KEY);
  if (cached) return cached;

  try {
    const response = await fetch(`${CORE_API}/standings`);
    const data = await response.json();
    
    const teams: Team[] = [];

    data.children?.forEach((conference: any) => {
      const confName = conference.name === 'Eastern Conference' ? 'East' : 'West';
      conference.standings.entries.forEach((entry: any) => {
        const stats = entry.stats;
        const wins = stats.find((s: any) => s.name === 'wins')?.value || 0;
        const losses = stats.find((s: any) => s.name === 'losses')?.value || 0;
        const rank = stats.find((s: any) => s.name === 'playoffSeed')?.value || 0;

        teams.push({
          id: entry.team.id,
          name: entry.team.displayName,
          location: entry.team.location,
          nickname: entry.team.name,
          abbr: entry.team.abbreviation,
          color: processTeamColor(entry.team.color),
          logoUrl: entry.team.logos?.[0]?.href || '',
          wins,
          losses,
          conference: confName,
          rank
        });
      });
    });

    saveToCache(CACHE_KEY, teams);
    return teams;
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    return [];
  }
};

export const fetchSchedule = async (): Promise<Game[]> => {
  const CACHE_KEY = 'nba_schedule_cache_v3'; // Incremented for new fields
  const cached = getFromCache<Game[]>(CACHE_KEY);
  if (cached) return cached;

  try {
    // Generate dates for next 5 days (Today + 4 days)
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}${mm}${dd}`);
    }

    // Fetch schedule for each day in parallel
    const promises = dates.map(date => 
      fetch(`${BASE_URL}/scoreboard?dates=${date}`).then(res => res.ok ? res.json() : null)
    );

    const results = await Promise.all(promises);
    
    // Combine events from all days
    const allEvents = results
      .filter(data => data && data.events)
      .flatMap(data => data.events);

    const games: Game[] = allEvents.map((event: any) => {
      const competition = event.competitions[0];
      const home = competition.competitors.find((c: any) => c.homeAway === 'home');
      const away = competition.competitors.find((c: any) => c.homeAway === 'away');

      // Helper to construct basic team obj for Game interface
      const toTeam = (comp: any) => ({
        id: comp.team.id,
        name: comp.team.displayName,
        location: comp.team.location,
        nickname: comp.team.name,
        abbr: comp.team.abbreviation,
        color: processTeamColor(comp.team.color),
        logoUrl: comp.team.logo || comp.team.logos?.[0]?.href || '',
        wins: parseInt(comp.records?.[0]?.summary?.split('-')[0] || '0'),
        losses: parseInt(comp.records?.[0]?.summary?.split('-')[1] || '0'),
        conference: 'East' as const, // Placeholder in game view
        rank: 0
      });

      const status: 'SCHEDULED' | 'LIVE' | 'FINAL' = event.status.type.state === 'post' ? 'FINAL' : event.status.type.state === 'in' ? 'LIVE' : 'SCHEDULED';
      
      return {
        id: event.id,
        homeTeam: toTeam(home),
        awayTeam: toTeam(away),
        date: event.date, // Store Raw ISO String for caching and local formatting
        time: '', // Deprecated in favor of calculating from date
        isNationalTv: competition.broadcasts?.some((b: any) => ['ABC', 'ESPN', 'TNT'].includes(b.names[0])),
        broadcaster: competition.broadcasts?.[0]?.names?.[0] || 'League Pass',
        status: status,
        homeScore: parseInt(home.score),
        awayScore: parseInt(away.score)
      };
    });

    saveToCache(CACHE_KEY, games);
    return games;
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    return [];
  }
};

export const fetchTeamDetails = async (teamId: string): Promise<{ roster: Player[], nextGames: Game[], lastGames: Game[] }> => {
  const CACHE_KEY = `nba_team_details_${teamId}_v3`;
  const cached = getFromCache<{ roster: Player[], nextGames: Game[], lastGames: Game[] }>(CACHE_KEY);
  if (cached) return cached;

  let roster: Player[] = [];
  let nextGames: Game[] = [];
  let lastGames: Game[] = [];

  // 1. Fetch Roster
  try {
    const response = await fetch(`${BASE_URL}/teams/${teamId}?enable=roster`);
    if (response.ok) {
        const data = await response.json();
        const team = data.team;
        roster = team.athletes?.map((athlete: any) => ({
          id: athlete.id,
          name: athlete.fullName,
          teamId: teamId,
          position: athlete.position?.abbreviation || 'N/A',
          headshotUrl: athlete.headshot?.href || 'https://a.espncdn.com/i/headshots/nba/players/full/0.png',
          weight: athlete.displayWeight,
          age: athlete.age || 0,
          injuryStatus: athlete.injuries?.[0] ? {
            status: athlete.injuries[0].status,
            detail: athlete.injuries[0].type.description,
            returnDate: athlete.injuries[0].date
          } : undefined,
          stats: {
            season: { ppg: 0, rpg: 0, apg: 0, efg: 0, ts: 0, usg: 0, per: 0 },
            last10: { ppg: 0, rpg: 0, apg: 0, efg: 0, ts: 0, usg: 0, per: 0 }
          },
          contract: { playerId: athlete.id, playerName: athlete.fullName, years: [], totalValue: 0, expiryYear: 2025 }
        })) || [];
    }
  } catch (error) {
    console.error("Failed to fetch roster:", error);
  }

  // 2. Fetch Team Schedule (Includes Past & Future)
  try {
    const scheduleResponse = await fetch(`${BASE_URL}/teams/${teamId}/schedule`);
    if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        const events = scheduleData.events || [];

        const allGames: Game[] = events.map((event: any) => {
            const competition = event.competitions?.[0];
            if (!competition) return null;
            
            const home = competition.competitors?.find((c: any) => c.homeAway === 'home');
            const away = competition.competitors?.find((c: any) => c.homeAway === 'away');
            
            if (!home || !away) return null;

            const toTeam = (comp: any) => ({
                id: comp.team?.id || comp.id,
                name: comp.team?.displayName || comp.team?.name || 'Unknown',
                location: comp.team?.location || '',
                nickname: comp.team?.name || comp.team?.shortName || '',
                abbr: comp.team?.abbreviation || '',
                color: processTeamColor(comp.team?.color),
                logoUrl: comp.team?.logo || comp.team?.logos?.[0]?.href || '',
                wins: 0,
                losses: 0,
                conference: 'East' as const,
                rank: 0
            });

            // Logic to determine status: check completed flag OR 'post' state
            const isCompleted = event.status?.type?.completed;
            const statusState = event.status?.type?.state;
            const status: 'SCHEDULED' | 'LIVE' | 'FINAL' = (isCompleted || statusState === 'post') 
                ? 'FINAL' 
                : statusState === 'in' ? 'LIVE' : 'SCHEDULED';

            // Safe integer parsing for scores
            const parseScore = (val: any) => {
                if (typeof val === 'number') return val;
                if (typeof val === 'string') return parseInt(val) || 0;
                if (val && val.value) return parseInt(val.value) || 0;
                return 0;
            };

            return {
                id: event.id,
                homeTeam: toTeam(home),
                awayTeam: toTeam(away),
                date: event.date,
                time: '',
                isNationalTv: false,
                broadcaster: '',
                status: status,
                homeScore: parseScore(home.score),
                awayScore: parseScore(away.score)
            };
        }).filter((g: any) => g !== null);

        // Sort by date (Oldest to Newest)
        allGames.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Slice Last 5 Final Games
        lastGames = allGames
            .filter(g => g.status === 'FINAL')
            .slice(-5)
            .reverse(); // Newest first

        // Slice Next 5 Upcoming Games
        nextGames = allGames
            .filter(g => g.status !== 'FINAL')
            .slice(0, 5);
    }
  } catch (error) {
    console.error("Failed to fetch team details schedule:", error);
  }

  const result = { roster, nextGames, lastGames };
  
  // Only cache if we got some data to prevent caching empty errors
  if (roster.length > 0 || nextGames.length > 0 || lastGames.length > 0) {
      saveToCache(CACHE_KEY, result);
  }

  return result;
};