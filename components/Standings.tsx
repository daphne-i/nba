import React from 'react';
import { THEME } from '../constants';
import { Trophy } from 'lucide-react';
import { Team } from '../types';

interface StandingsProps {
  teams: Team[];
  onTeamClick: (teamId: string) => void;
}

const Standings: React.FC<StandingsProps> = ({ teams, onTeamClick }) => {
  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);
  const eastTeams = sortedTeams.filter(t => t.conference === 'East');
  const westTeams = sortedTeams.filter(t => t.conference === 'West');

  const renderTable = (title: string, conferenceTeams: Team[]) => (
    <div style={{ flex: 1, minWidth: '350px' }}>
      <h3 style={{ 
        fontFamily: THEME.fonts.sans, 
        fontSize: '1rem', 
        fontWeight: 600, 
        color: THEME.colors.text, 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '4px', height: '16px', backgroundColor: THEME.colors.accent, borderRadius: '2px' }} />
        {title}
      </h3>
      <div style={{ 
        backgroundColor: THEME.colors.card, 
        borderRadius: THEME.radius.lg, 
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', fontFamily: THEME.fonts.sans }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: THEME.colors.muted, textAlign: 'left', fontSize: '0.75rem' }}>
              <th style={{ padding: '16px', fontWeight: 600, width: '60px' }}>#</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Team</th>
              <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>W-L</th>
              <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Pct</th>
            </tr>
          </thead>
          <tbody>
            {conferenceTeams.map((team) => (
              <tr 
                key={team.id}
                onClick={() => onTeamClick(team.id)}
                style={{ 
                  borderTop: `1px solid ${THEME.colors.border}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  color: THEME.colors.text
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px', color: THEME.colors.muted, fontWeight: 500 }}>{team.rank}</td>
                <td style={{ padding: '16px', fontWeight: 600, color: THEME.colors.white, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={team.logoUrl} alt={team.abbr} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                  <span>{team.name}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 500 }}>
                  <span style={{ color: THEME.colors.white }}>{team.wins}</span>
                  <span style={{ color: THEME.colors.muted, margin: '0 4px' }}>-</span>
                  <span style={{ color: THEME.colors.muted }}>{team.losses}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', color: THEME.colors.muted, fontVariantNumeric: 'tabular-nums' }}>
                  {team.wins + team.losses > 0 
                    ? (team.wins / (team.wins + team.losses)).toFixed(3) 
                    : '.000'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '12px' }}>
          <Trophy color={THEME.colors.accent} size={24} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontFamily: THEME.fonts.display, fontWeight: 'bold', color: THEME.colors.white }}>
          League Standings
        </h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {renderTable('Western Conference', westTeams)}
        {renderTable('Eastern Conference', eastTeams)}
      </div>
    </div>
  );
};

export default Standings;