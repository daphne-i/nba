import React, { useState } from 'react';
import { Game, Team } from '../types';
import { Eye, Tv } from 'lucide-react';
import { THEME } from '../constants';

interface GameCardProps {
  game: Game;
  onTeamClick?: (teamId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onTeamClick }) => {
  const [showScores, setShowScores] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTeamClick = (e: React.MouseEvent, teamId: string) => {
    if (onTeamClick) {
      e.stopPropagation();
      onTeamClick(teamId);
    }
  };

  const formatGameTime = (isoDateString: string) => {
    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) return null;

      const etTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'
      });
      
      const istTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
      });

      const day = date.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York'
      });

      return { etTime, istTime, day };
    } catch (e) {
      return null;
    }
  };

  const timeData = formatGameTime(game.date);
  const isIso = !!timeData;

  const teamNameStyle = {
    cursor: onTeamClick ? 'pointer' : 'default',
    transition: 'opacity 0.2s',
  };

  const renderTeamSection = (team: Team, alignRight: boolean) => {
    // Fallback if location/nickname are missing
    const city = team.location || team.name.split(' ').slice(0, -1).join(' ');
    const nick = team.nickname || team.name.split(' ').pop() || team.abbr;

    const TextBlock = (
      <div 
        onClick={(e) => handleTeamClick(e, team.id)}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: alignRight ? 'flex-end' : 'flex-start', 
          lineHeight: 1.2,
          ...teamNameStyle
        }}
        onMouseEnter={(e) => { if(onTeamClick) e.currentTarget.style.opacity = '0.8' }}
        onMouseLeave={(e) => { if(onTeamClick) e.currentTarget.style.opacity = '1' }}
      >
        <span style={{ 
          fontSize: '0.75rem', 
          color: THEME.colors.muted, 
          fontFamily: THEME.fonts.sans, 
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }}>
          {city}
        </span>
        <span style={{ 
          fontSize: '1.125rem', 
          fontWeight: '700', 
          fontFamily: THEME.fonts.display,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          color: THEME.colors.white
        }}>
          {nick}
        </span>
        <div style={{ fontSize: '0.7rem', color: THEME.colors.muted, fontFamily: THEME.fonts.sans, marginTop: '2px' }}>
             {team.wins}-{team.losses}
        </div>
      </div>
    );

    const IconBlock = (
      <img 
        src={team.logoUrl} 
        alt={team.abbr} 
        style={{ 
          width: '36px', 
          height: '36px', 
          objectFit: 'contain', 
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
        onClick={(e) => handleTeamClick(e, team.id)}
      />
    );

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        flex: 1,
        justifyContent: alignRight ? 'flex-end' : 'flex-start'
      }}>
        {!alignRight && IconBlock}
        {TextBlock}
        {alignRight && IconBlock}
      </div>
    );
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: `1px solid ${isHovered ? THEME.colors.border : 'transparent'}`,
        backgroundColor: THEME.colors.card,
        padding: '16px',
        borderRadius: THEME.radius.lg,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Time & Broadcast Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '8px', borderBottom: `1px solid ${THEME.colors.border}` }}>
        <div style={{
          fontSize: '0.75rem',
          color: THEME.colors.muted,
          fontFamily: THEME.fonts.sans,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
           {isIso ? (
             <>
               <div style={{ color: THEME.colors.text, fontWeight: 600 }}>{timeData.day}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span>{timeData.etTime} ET</span>
                 <span style={{ color: THEME.colors.accent, fontWeight: 500 }}>{timeData.istTime} IST</span>
               </div>
             </>
           ) : (
             <span>{game.date}</span>
           )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: THEME.fonts.sans, color: THEME.colors.muted }}>
            {game.isNationalTv && <Tv size={12} color={THEME.colors.accent} />}
            <span style={{ color: THEME.colors.text, fontWeight: 500 }}>{game.broadcaster}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Home Team (Left) */}
        {renderTeamSection(game.homeTeam, false)}

        {/* Score / VS (Center) */}
        <div style={{ padding: '0 12px', textAlign: 'center', minWidth: '40px' }}>
          {game.status === 'FINAL' || game.status === 'LIVE' ? (
             showScores || game.status === 'FINAL' ? (
               <div style={{ fontFamily: THEME.fonts.display, fontSize: '1.25rem', fontWeight: 'bold', color: THEME.colors.white, whiteSpace: 'nowrap' }}>
                 {game.homeScore} - {game.awayScore}
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                 <button 
                   onClick={() => setShowScores(true)}
                   style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: THEME.colors.accent, padding: '6px', borderRadius: '50%' }}
                 >
                   <Eye size={18} />
                 </button>
               </div>
             )
          ) : (
            <span style={{ fontFamily: THEME.fonts.sans, color: THEME.colors.muted, fontSize: '0.875rem', fontWeight: 600 }}>VS</span>
          )}
        </div>

        {/* Away Team (Right) */}
        {renderTeamSection(game.awayTeam, true)}
      </div>
    </div>
  );
};

export default GameCard;