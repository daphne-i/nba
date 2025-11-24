import React, { useEffect, useState } from 'react';
import { THEME } from '../constants';
import GameCard from './GameCard';
import { Users, Timer, AlertTriangle, ArrowLeft, Loader } from 'lucide-react';
import { fetchTeamDetails } from '../services/nbaService';
import { Player, Team, Game } from '../types';

interface TeamDetailProps {
  teamId: string;
  teamData?: Team;
  globalGames: Game[];
  onBack: () => void;
}

const TeamDetail: React.FC<TeamDetailProps> = ({ teamId, teamData, globalGames, onBack }) => {
  const [roster, setRoster] = useState<Player[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadTeamDetails = async () => {
      setLoading(true);
      const { roster, nextGames } = await fetchTeamDetails(teamId);
      setRoster(roster);
      setUpcomingGames(nextGames);
      setLoading(false);
    };
    loadTeamDetails();
  }, [teamId]);

  if (!teamData && !loading) return <div>Team Data Unavailable</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-in-out', paddingBottom: '32px' }}>
      {/* Back Navigation */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: THEME.colors.muted,
          cursor: 'pointer',
          fontFamily: THEME.fonts.sans,
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '8px 0',
          width: 'fit-content',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = THEME.colors.text}
        onMouseLeave={(e) => e.currentTarget.style.color = THEME.colors.muted}
      >
        <ArrowLeft size={18} />
        Back to League
      </button>

      {/* Header */}
      {teamData && (
        <div style={{
            padding: isMobile ? '24px 16px' : '32px',
            backgroundColor: THEME.colors.card,
            borderRadius: THEME.radius.lg,
            border: `1px solid ${THEME.colors.border}`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center', 
              gap: isMobile ? '16px' : '32px',
              textAlign: isMobile ? 'center' : 'left'
            }}>
            <div style={{
                width: isMobile ? '80px' : '120px', 
                height: isMobile ? '80px' : '120px', 
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: isMobile ? '12px' : '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                flexShrink: 0
            }}>
                <img src={teamData.logoUrl} alt={teamData.abbr} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ width: '100%' }}>
                <h1 style={{ 
                  fontSize: isMobile ? '2rem' : '3rem', 
                  fontWeight: 700, 
                  margin: 0, 
                  color: THEME.colors.white, 
                  letterSpacing: '-0.02em', 
                  fontFamily: THEME.fonts.display, 
                  lineHeight: 1.1
                }}>
                  {teamData.name}
                </h1>
                <div style={{ 
                  fontFamily: THEME.fonts.sans, 
                  color: THEME.colors.muted, 
                  marginTop: '12px', 
                  fontSize: isMobile ? '0.9rem' : '1.125rem', 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center', 
                  gap: isMobile ? '8px' : '16px',
                  justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
                   <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>{teamData.conference} Conference</span>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <span style={{ fontWeight: 600 }}>Rank #{teamData.rank}</span>
                     <span style={{ 
                       borderLeft: `1px solid ${THEME.colors.border}`, 
                       paddingLeft: '16px',
                       display: 'flex',
                       gap: '4px'
                     }}>
                       <span style={{ color: THEME.colors.success, fontWeight: 700 }}>{teamData.wins}</span> W - <span style={{ color: THEME.colors.danger, fontWeight: 700 }}>{teamData.losses}</span> L
                     </span>
                   </div>
                </div>
            </div>
            </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
            <Loader className="animate-spin" color={THEME.colors.accent} size={32} />
        </div>
      ) : (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '32px' 
      }}>
        
        {/* Roster Column */}
        <div style={{ minWidth: 0 }}> {/* minWidth 0 prevents grid blowout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <Users color={THEME.colors.accent} size={20} />
            </div>
            <h3 style={{ fontFamily: THEME.fonts.display, fontSize: '1.25rem', fontWeight: 600, color: THEME.colors.white }}>Active Roster</h3>
          </div>
          
          <div style={{ backgroundColor: THEME.colors.card, border: `1px solid ${THEME.colors.border}`, borderRadius: THEME.radius.lg, overflow: 'hidden', maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', fontFamily: THEME.fonts.sans }}>
              <tbody>
                {roster.length > 0 ? roster.map((player) => (
                  <tr key={player.id} style={{ borderBottom: `1px solid ${THEME.colors.border}` }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={player.headshotUrl} 
                            alt={player.name}
                            style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${THEME.colors.border}`
                            }} 
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/headshots/nba/players/full/0.png'; }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: THEME.colors.white, fontSize: '1rem' }}>{player.name}</div>
                            <div style={{ fontSize: '0.75rem', color: THEME.colors.muted, marginTop: '2px' }}>{player.position}</div>
                          </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {player.injuryStatus && (
                         <div style={{ fontSize: '0.75rem', color: THEME.colors.danger, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontWeight: 500 }}>
                           <AlertTriangle size={12} /> {player.injuryStatus.status}
                         </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td style={{ padding: '24px', color: THEME.colors.muted, textAlign: 'center' }}>No active roster data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0 }}>
          
          {/* Upcoming */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <Timer color={THEME.colors.warning} size={20} />
              </div>
              <h3 style={{ fontFamily: THEME.fonts.display, fontSize: '1.25rem', fontWeight: 600, color: THEME.colors.white }}>Upcoming</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {upcomingGames.length > 0 ? upcomingGames.map(game => (
                <GameCard key={game.id} game={game} />
              )) : (
                <div style={{ color: THEME.colors.muted, padding: '16px', border: `1px dashed ${THEME.colors.border}`, borderRadius: THEME.radius.md, textAlign: 'center' }}>
                    No upcoming games scheduled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default TeamDetail;