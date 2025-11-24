import React from 'react';
import { Game } from '../types';
import { THEME } from '../constants';
import GameCard from './GameCard';

interface ScheduleGridProps {
  games: Game[];
  onTeamClick: (teamId: string) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ games, onTeamClick }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        display: 'grid',
        // Optimized for a dense 2-column look on typical screens
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px'
      }}>
        {games.length > 0 ? games.map((game) => (
          <GameCard key={game.id} game={game} onTeamClick={onTeamClick} />
        )) : (
            <div style={{ gridColumn: '1/-1', padding: '32px', textAlign: 'center', color: THEME.colors.muted, fontFamily: THEME.fonts.mono }}>
                NO_ACTIVE_GAMES_FOUND_IN_WINDOW
            </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleGrid;