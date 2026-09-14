import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, Activity, Users, Box, Thermometer, Droplets } from 'lucide-react';
import type { StatsResponse } from '../services/api';

interface FridgeStatusHUDProps {
  stats: StatsResponse | null;
}

export const FridgeStatusHUD: React.FC<FridgeStatusHUDProps> = ({ stats }) => {
  const fillPct = stats?.current_fill_pct ?? 68;
  const status = stats?.fridge_status ?? 'all_fine';

  const getStatusBadge = () => {
    switch (status) {
      case 'risk':
        return {
          title: 'SPOILAGE RISK DETECTED',
          desc: 'Potentially hazardous food detected. Pull notice sent to volunteers.',
          badgeClass: 'badge-rose',
          dotClass: 'pulse-dot-rose',
          icon: <AlertOctagon size={20} color="#fb7185" />,
          borderColor: 'var(--border-glow-risk)',
        };
      case 'critically_empty':
        return {
          title: 'CRITICALLY EMPTY (<20%)',
          desc: 'Shelf supplies depleted. Automatic Haversine restock dispatched to nearest donor.',
          badgeClass: 'badge-amber',
          dotClass: 'pulse-dot-amber',
          icon: <AlertTriangle size={20} color="#fbbf24" />,
          borderColor: 'var(--border-glow-warn)',
        };
      default:
        return {
          title: 'ALL FINE & NOMINAL',
          desc: 'Adequately stocked and food appears safe for community members.',
          badgeClass: 'badge-emerald',
          dotClass: 'pulse-dot-emerald',
          icon: <CheckCircle2 size={20} color="#34d399" />,
          borderColor: 'var(--border-glow)',
        };
    }
  };

  const statusConfig = getStatusBadge();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: Active Status */}
      <div 
        className="neo-box-static" 
        style={{ 
          padding: '1.25rem 1.5rem', 
          borderLeft: `6px solid ${status === 'risk' ? 'var(--neo-coral)' : status === 'critically_empty' ? 'var(--neo-yellow)' : 'var(--neo-green)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#0d121f',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: status === 'risk' ? 'var(--neo-coral)' : status === 'critically_empty' ? 'var(--neo-yellow)' : 'var(--neo-green)',
            border: '2px solid #000',
            boxShadow: '2px 2px 0px #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: status === 'risk' ? '#fff' : '#000',
          }}>
            {statusConfig.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>
                {statusConfig.title}
              </span>
              <span
                className="neo-sticker"
                style={{
                  background: status === 'risk' ? 'var(--neo-coral)' : status === 'critically_empty' ? 'var(--neo-yellow)' : 'var(--neo-green)',
                  color: status === 'risk' ? '#fff' : '#000',
                }}
              >
                LIVE STATUS
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {statusConfig.desc}
            </p>
          </div>
        </div>

        {/* Environmental Telemetry */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '8px 16px', background: '#07090e', borderRadius: '10px', border: '2px solid #000', boxShadow: '2px 2px 0px #000' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer size={18} color="var(--neo-cyan)" />
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTERNAL TEMP</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--neo-cyan)' }}>3.8°C</div>
            </div>
          </div>
          <div style={{ width: '2px', height: '24px', background: '#1e293b' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={18} color="var(--neo-green)" />
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HUMIDITY</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--neo-green)' }}>44%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        {/* Capacity / Fill Meter */}
        <div className="neo-box metric-card" style={{ background: '#0d1322' }}>
          <div>
            <div className="metric-title">ESTIMATED FILL LEVEL</div>
            <div className="metric-value">
              <span>{fillPct}%</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: fillPct < 20 ? 'var(--neo-coral)' : 'var(--neo-green)' }}>
                {fillPct < 20 ? 'CRITICAL' : fillPct < 50 ? 'MODERATE' : 'OPTIMAL'}
              </span>
            </div>
            <div className="metric-subtext">Threshold: &lt;20% triggers SMS dispatch</div>
            {/* Mini bar */}
            <div style={{ width: '100%', height: '8px', background: '#080c14', border: '1.5px solid #000', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(100, Math.max(5, fillPct))}%`, 
                  background: fillPct < 20 ? 'var(--neo-coral)' : fillPct < 50 ? 'var(--neo-yellow)' : 'var(--neo-green)',
                  transition: 'width 0.6s ease'
                }} 
              />
            </div>
          </div>
          <div style={{ padding: '8px', background: '#07090e', border: '2px solid #000', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}>
            <Box size={22} color="var(--neo-cyan)" />
          </div>
        </div>

        {/* Total Check-ins */}
        <div className="neo-box metric-card" style={{ background: '#0d1322' }}>
          <div>
            <div className="metric-title">CHECK-INS PROCESSED</div>
            <div className="metric-value">{stats?.total_checkins ?? 0}</div>
            <div className="metric-subtext">Community &amp; volunteer SMS logs</div>
          </div>
          <div style={{ padding: '8px', background: '#07090e', border: '2px solid #000', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}>
            <Activity size={22} color="var(--neo-green)" />
          </div>
        </div>

        {/* Spoilage Risk Interventions */}
        <div className="neo-box metric-card" style={{ background: '#0d1322' }}>
          <div>
            <div className="metric-title">SPOILAGE INTERVENTIONS</div>
            <div className="metric-value" style={{ color: stats && stats.risk_count > 0 ? 'var(--neo-coral)' : 'inherit' }}>
              {stats?.risk_count ?? 0}
            </div>
            <div className="metric-subtext">Expired or unsafe food pulled</div>
          </div>
          <div style={{ padding: '8px', background: '#07090e', border: '2px solid #000', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}>
            <AlertOctagon size={22} color="var(--neo-coral)" />
          </div>
        </div>

        {/* Restock Dispatches */}
        <div className="neo-box metric-card" style={{ background: '#0d1322' }}>
          <div>
            <div className="metric-title">RESTOCK DISPATCHES</div>
            <div className="metric-value" style={{ color: stats && stats.critically_empty_count > 0 ? 'var(--neo-yellow)' : 'inherit' }}>
              {stats?.critically_empty_count ?? 0}
            </div>
            <div className="metric-subtext">{stats?.active_donors_count ?? 5} donors in active radius</div>
          </div>
          <div style={{ padding: '8px', background: '#07090e', border: '2px solid #000', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}>
            <Users size={22} color="var(--neo-purple)" />
          </div>
        </div>
      </div>
    </div>
  );
};
