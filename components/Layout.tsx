import React from 'react';
import { THEME } from '../constants';
import { Dribbble } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: THEME.colors.bg,
      color: THEME.colors.text,
      fontFamily: THEME.fonts.sans,
      paddingBottom: '80px', // Space for bottom nav
    }}>
      {/* Branding Header */}
      <header style={{
        borderBottom: `1px solid ${THEME.colors.border}`,
        backgroundColor: 'rgba(24, 26, 32, 0.8)', // Semi-transparent
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '0 16px',
        height: '64px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: THEME.colors.card,
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Dribbble color={THEME.colors.accent} size={24} />
          </div>
          <span style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: THEME.colors.white,
            letterSpacing: '0.02em'
          }}>
            NBA
          </span>
        </div>
      </header>

      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 16px',
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;