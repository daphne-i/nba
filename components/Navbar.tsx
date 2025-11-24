import React from 'react';
import { ViewState } from '../types';
import { LayoutGrid, Trophy } from 'lucide-react';
import { THEME } from '../constants';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.SCHEDULE, label: 'Schedule', icon: LayoutGrid },
    { id: ViewState.STANDINGS, label: 'Standings', icon: Trophy },
  ];

  return (
    <nav style={{
      width: '100%',
      borderTop: `1px solid ${THEME.colors.border}`,
      backgroundColor: 'rgba(24, 26, 32, 0.95)',
      backdropFilter: 'blur(12px)',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 50,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 24px',
                fontFamily: THEME.fonts.sans,
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: isActive ? THEME.colors.accent : THEME.colors.muted,
                fontWeight: isActive ? 600 : 400,
                position: 'relative'
              }}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  width: '40%',
                  height: '3px',
                  backgroundColor: THEME.colors.accent,
                  borderBottomLeftRadius: '4px',
                  borderBottomRightRadius: '4px',
                  boxShadow: `0 2px 8px ${THEME.colors.accent}`
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;