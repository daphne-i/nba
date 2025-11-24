import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import ScheduleGrid from './components/ScheduleGrid';
import Standings from './components/Standings';
import TeamDetail from './components/TeamDetail';
import { ViewState, Team, Game } from './types';
import { fetchStandings, fetchSchedule } from './services/nbaService';
import { Loader } from 'lucide-react';
import { THEME } from './constants';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.SCHEDULE);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.SCHEDULE);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Data State
  const [teams, setTeams] = useState<Team[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const [teamsData, gamesData] = await Promise.all([
        fetchStandings(),
        fetchSchedule()
      ]);
      setTeams(teamsData);
      setGames(gamesData);
      setLoading(false);
    };

    initData();
  }, []);

  const handleTeamClick = (teamId: string) => {
    if (currentView !== ViewState.TEAM_DETAIL) {
      setPreviousView(currentView);
    }
    setSelectedTeamId(teamId);
    setView(ViewState.TEAM_DETAIL);
  };

  const handleBack = () => {
    setView(previousView);
    setSelectedTeamId(null);
  };

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  const renderView = () => {
    if (loading) {
      return (
        <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: THEME.colors.accent, gap: '16px' }}>
          <Loader size={48} className="animate-spin" /> {/* animate-spin is standard css, but if not available we rely on icon */}
          <div style={{ fontFamily: THEME.fonts.mono }}>CONNECTING_TO_LIVE_FEED...</div>
        </div>
      );
    }

    switch (currentView) {
      case ViewState.SCHEDULE:
        return <ScheduleGrid games={games} onTeamClick={handleTeamClick} />;
      case ViewState.STANDINGS:
        return <Standings teams={teams} onTeamClick={handleTeamClick} />;
      case ViewState.TEAM_DETAIL:
        return selectedTeamId ? (
          <TeamDetail 
            teamId={selectedTeamId} 
            teamData={getTeamById(selectedTeamId)}
            globalGames={games}
            onBack={handleBack} 
          />
        ) : (
          <ScheduleGrid games={games} onTeamClick={handleTeamClick} />
        );
      default:
        return <ScheduleGrid games={games} onTeamClick={handleTeamClick} />;
    }
  };

  return (
    <>
      <Navbar currentView={currentView} setView={setView} />
      <Layout>
        {renderView()}
      </Layout>
    </>
  );
};

export default App;