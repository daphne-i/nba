import React from 'react';
import { MOCK_PICKS, MOCK_SALARY_CAP_DATA, THEME } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DollarSign, Briefcase } from 'lucide-react';

const TeamAssets: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '24px' }}>
        
        {/* Left Col: Salary Cap */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
             <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <DollarSign color={THEME.colors.success} size={20} />
             </div>
             <h2 style={{ fontSize: '1.25rem', fontFamily: THEME.fonts.display, fontWeight: 600, color: THEME.colors.white }}>Salary Cap Breakdown</h2>
          </div>
          
          <div style={{ backgroundColor: THEME.colors.card, border: `1px solid ${THEME.colors.border}`, padding: '24px', borderRadius: THEME.radius.lg, height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_SALARY_CAP_DATA}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#9E9E9E" tick={{fontFamily: 'Inter', fontSize: 11}} />
                <YAxis dataKey="name" type="category" stroke="#E0E0E0" tick={{fontFamily: 'Inter', fontSize: 12, fontWeight: 500}} width={70} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', fontFamily: 'Inter', borderRadius: '6px' }}
                  itemStyle={{ fontSize: 12 }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12, paddingTop: 10 }} />
                <ReferenceLine x={141} stroke={THEME.colors.danger} strokeDasharray="3 3" label={{ position: 'top', value: 'Cap Line', fill: THEME.colors.danger, fontSize: 10, fontFamily: 'Inter' }} />
                <Bar dataKey="Guaranteed" stackId="a" fill={THEME.colors.success} barSize={24} radius={[0,0,0,0]} />
                <Bar dataKey="Options" stackId="a" fill={THEME.colors.warning} radius={[0,0,0,0]} />
                <Bar dataKey="CapSpace" stackId="a" fill={THEME.colors.accent} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Draft Picks */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
             <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <Briefcase color={THEME.colors.warning} size={20} />
             </div>
             <h2 style={{ fontSize: '1.25rem', fontFamily: THEME.fonts.display, fontWeight: 600, color: THEME.colors.white }}>Draft Assets</h2>
          </div>

          <div style={{ backgroundColor: THEME.colors.card, border: `1px solid ${THEME.colors.border}`, padding: '16px', borderRadius: THEME.radius.lg, display: 'flex', flexDirection: 'column', gap: '4px' }}>
             {MOCK_PICKS.map((pick, idx) => (
               <div key={idx} style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 fontFamily: THEME.fonts.sans,
                 fontSize: '0.875rem',
                 padding: '12px 8px',
                 borderBottom: idx === MOCK_PICKS.length - 1 ? 'none' : `1px solid ${THEME.colors.border}`,
               }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span style={{ color: THEME.colors.white, fontWeight: 600 }}>{pick.year}</span>
                   <span style={{
                     padding: '2px 8px',
                     borderRadius: '12px',
                     fontSize: '0.7rem',
                     fontWeight: 700,
                     backgroundColor: pick.round === 1 ? THEME.colors.accent : 'rgba(255,255,255,0.1)',
                     color: THEME.colors.white
                   }}>
                     R{pick.round}
                   </span>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{
                     color: pick.status === 'OWED' ? THEME.colors.danger : THEME.colors.success,
                     fontWeight: 600,
                     fontSize: '0.8rem'
                   }}>
                     {pick.status} {pick.status !== 'OWNED' && `(${pick.originalOwner})`}
                   </div>
                   {pick.condition && <div style={{ fontSize: '0.75rem', color: THEME.colors.muted }}>{pick.condition}</div>}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAssets;