import React from 'react';
import { Shield, RefreshCw, Radio, Server, Clock } from 'lucide-react';
import type { HealthResponse } from '../services/api';

interface HeaderProps {
  health: HealthResponse | null;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: Date;
}

export const Header: React.FC<HeaderProps> = ({ health, loading, onRefresh, lastUpdated }) => {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="glass-panel top-header">
      <div className="logo-brand">
        <div className="logo-icon">
          <Shield size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="brand-title">SENTINEL</h1>
          <div className="brand-subtitle">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span>COMMUNITY FRIDGE AI & MUTUAL AID DISPATCH</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Backend health pill */}
        <div className={`badge ${isHealthy ? 'badge-emerald' : 'badge-rose'}`}>
          <div className={`pulse-dot ${isHealthy ? 'pulse-dot-emerald' : 'pulse-dot-rose'}`} />
          <span>{isHealthy ? 'SYSTEM OPERATIONAL' : 'BACKEND OFFLINE'}</span>
        </div>

        {/* Fridge info */}
        {health?.fridge_id && (
          <div className="badge badge-cyan" style={{ display: 'none', minWidth: 0 }}>
            <Server size={12} />
            <span>{health.fridge_id}</span>
          </div>
        )}

        {/* Last updated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
          <Clock size={14} />
          <span>{lastUpdated.toLocaleTimeString()}</span>
        </div>

        {/* Refresh button */}
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh telemetry"
          style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
};
