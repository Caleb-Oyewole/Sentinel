import React from 'react';
import { Shield, Radio, Terminal, Compass, Zap, RefreshCw } from 'lucide-react';
import type { HealthResponse } from '../services/api';

interface NavbarProps {
  activeView: 'landing' | 'console';
  onViewChange: (view: 'landing' | 'console') => void;
  health: HealthResponse | null;
  loading: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onViewChange,
  health,
  loading,
  onRefresh,
}) => {
  const isHealthy = health?.status === 'healthy';

  return (
    <nav
      className="neo-box-static"
      style={{
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#0d121f',
        position: 'sticky',
        top: '12px',
        zIndex: 50,
      }}
    >
      {/* Brand logo & title */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => onViewChange('landing')}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--neo-yellow)',
            border: '2.5px solid var(--neo-border)',
            boxShadow: '2px 2px 0px #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
          }}
        >
          <Shield size={24} strokeWidth={2.8} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              SENTINEL
            </span>
            <span
              className="neo-sticker"
              style={{ background: 'var(--neo-green)', color: '#000' }}
            >
              AI AGENT HUB
            </span>
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Radio size={12} color="var(--neo-green)" className="animate-pulse" />
            <span>AUTONOMOUS COMMUNITY FRIDGE NETWORK</span>
          </div>
        </div>
      </div>

      {/* Center View Selector Pill */}
      <div
        style={{
          display: 'flex',
          background: '#07090e',
          padding: '4px',
          borderRadius: '10px',
          border: '2px solid var(--neo-border)',
          boxShadow: '2px 2px 0px #000',
          gap: '4px',
        }}
      >
        <button
          onClick={() => onViewChange('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '7px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeView === 'landing' ? '2px solid #000' : '2px solid transparent',
            background: activeView === 'landing' ? 'var(--neo-yellow)' : 'transparent',
            color: activeView === 'landing' ? '#000' : 'var(--text-secondary)',
            boxShadow: activeView === 'landing' ? '2px 2px 0px #000' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Compass size={15} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onViewChange('console')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '7px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeView === 'console' ? '2px solid #000' : '2px solid transparent',
            background: activeView === 'console' ? 'var(--neo-cyan)' : 'transparent',
            color: activeView === 'console' ? '#000' : 'var(--text-secondary)',
            boxShadow: activeView === 'console' ? '2px 2px 0px #000' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Terminal size={15} />
          <span>Live Console</span>
        </button>
      </div>

      {/* Right status & launch button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Connection status */}
        <div
          className="neo-pill"
          style={{
            background: isHealthy ? '#062817' : '#2b0c14',
            color: isHealthy ? 'var(--neo-green)' : 'var(--neo-coral)',
            borderColor: isHealthy ? 'var(--neo-green)' : 'var(--neo-coral)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isHealthy ? 'var(--neo-green)' : 'var(--neo-coral)',
              boxShadow: isHealthy ? '0 0 8px var(--neo-green)' : '0 0 8px var(--neo-coral)',
            }}
          />
          <span>{isHealthy ? 'AGENTCORE LIVE' : 'BACKEND OFFLINE'}</span>
        </div>

        {/* Sync telemetry */}
        <button
          className="neo-btn neo-btn-dark"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh server telemetry"
          style={{ padding: '8px 12px', fontSize: '0.75rem' }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Sync</span>
        </button>

        {/* Primary CTA */}
        {activeView === 'landing' ? (
          <button
            className="neo-btn neo-btn-primary"
            onClick={() => onViewChange('console')}
            style={{ padding: '9px 16px', fontSize: '0.8125rem' }}
          >
            <Zap size={14} />
            <span>Open Console</span>
          </button>
        ) : (
          <button
            className="neo-btn neo-btn-cyan"
            onClick={() => onViewChange('landing')}
            style={{ padding: '9px 16px', fontSize: '0.8125rem' }}
          >
            <Compass size={14} />
            <span>Story & Docs</span>
          </button>
        )}
      </div>
    </nav>
  );
};
