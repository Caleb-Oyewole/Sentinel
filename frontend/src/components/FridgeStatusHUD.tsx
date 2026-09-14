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
        className="glass-panel" 
        style={{ 
          padding: '1.25rem 1.5rem', 
          borderLeft: `4px solid ${status === 'risk' ? '#f43f5e' : status === 'critically_empty' ? '#f59e0b' : '#10b981'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: status === 'risk' ? 'rgba(244,63,94,0.15)' : status === 'critically_empty' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {statusConfig.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem' }}>
                {statusConfig.title}
              </span>
              <span className={`badge ${statusConfig.badgeClass}`}>
                <span className={`pulse-dot ${statusConfig.dotClass}`} />
                LIVE
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {statusConfig.desc}
            </p>
          </div>
        </div>

        {/* Environmental Telemetry */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '6px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={16} className="text-cyan-400" />
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTERNAL TEMP</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>3.8°C</div>
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={16} className="text-emerald-400" />
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HUMIDITY</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#34d399' }}>44%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        {/* Capacity / Fill Meter */}
        <div className="glass-panel metric-card">
          <div>
            <div className="metric-title">ESTIMATED FILL LEVEL</div>
            <div className="metric-value">
              <span>{fillPct}%</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: fillPct < 20 ? '#fb7185' : '#34d399' }}>
                {fillPct < 20 ? 'CRITICAL' : fillPct < 50 ? 'MODERATE' : 'OPTIMAL'}
              </span>
            </div>
            <div className="metric-subtext">Threshold: &lt;20% triggers SMS dispatch</div>
            {/* Mini bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(100, Math.max(5, fillPct))}%`, 
                  background: fillPct < 20 ? '#f43f5e' : fillPct < 50 ? '#f59e0b' : '#10b981',
                  transition: 'width 0.6s ease'
                }} 
              />
            </div>
          </div>
          <Box size={26} color="#06b6d4" opacity={0.7} />
        </div>

        {/* Total Check-ins */}
        <div className="glass-panel metric-card">
          <div>
            <div className="metric-title">CHECK-INS PROCESSED</div>
            <div className="metric-value">{stats?.total_checkins ?? 0}</div>
            <div className="metric-subtext">Community & volunteer SMS logs</div>
          </div>
          <Activity size={26} color="#10b981" opacity={0.7} />
        </div>

        {/* Spoilage Risk Interventions */}
        <div className="glass-panel metric-card">
          <div>
            <div className="metric-title">SPOILAGE INTERVENTIONS</div>
            <div className="metric-value" style={{ color: stats && stats.risk_count > 0 ? '#fb7185' : 'inherit' }}>
              {stats?.risk_count ?? 0}
            </div>
            <div className="metric-subtext">Expired or bad food pulled</div>
          </div>
          <AlertOctagon size={26} color="#f43f5e" opacity={0.7} />
        </div>

        {/* Restock Dispatches */}
        <div className="glass-panel metric-card">
          <div>
            <div className="metric-title">RESTOCK DISPATCHES</div>
            <div className="metric-value" style={{ color: stats && stats.critically_empty_count > 0 ? '#fbbf24' : 'inherit' }}>
              {stats?.critically_empty_count ?? 0}
            </div>
            <div className="metric-subtext">{stats?.active_donors_count ?? 5} donors in active radius</div>
          </div>
          <Users size={26} color="#8b5cf6" opacity={0.7} />
        </div>
      </div>
    </div>
  );
};
