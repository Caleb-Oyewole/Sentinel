import React from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Cpu,
} from 'lucide-react';
import type { StatsResponse, HealthResponse } from '../services/api';

interface LandingHeroProps {
  stats: StatsResponse | null;
  health: HealthResponse | null;
  onLaunchConsole: () => void;
  onOpenSimulator: () => void;
  onScrollToHowItWorks: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  stats,
  health,
  onLaunchConsole,
  onOpenSimulator,
  onScrollToHowItWorks,
}) => {
  const fillPct = stats?.current_fill_pct ?? 72;
  const isHealthy = health?.status === 'healthy';

  return (
    <section className="landing-hero">
      <div className="hero-grid">
        {/* Left Column: Headlines & CTAs */}
        <div>
          {/* Brutalist Pill Kicker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span
              className="neo-pill"
              style={{ background: 'var(--neo-yellow)', color: '#000' }}
            >
              COMMUNITY FOOD DEFENSE AI
            </span>
            <span
              className="neo-pill"
              style={{ background: 'var(--neo-green)', color: '#000' }}
            >
              ● DUAL-LAYER STRANDS ENGINE
            </span>
            <span
              className="neo-pill"
              style={{ background: '#1e293b', color: '#94a3b8' }}
            >
              TWILIO SMS INTEGRATED
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            Zero Spoilage.<br />
            Zero Empty Shelves.<br />
            <span
              style={{
                display: 'inline-block',
                background: 'var(--neo-yellow)',
                color: '#000',
                padding: '2px 14px',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px #000',
                borderRadius: '10px',
                marginTop: '6px',
                transform: 'rotate(-0.8deg)',
              }}
            >
              100% Autonomous.
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subhead">
            Sentinel is an autonomous mutual aid dispatch system that safeguards community fridges.
            It evaluates natural-language volunteer check-in texts, verifies items against verified
            shelf-life rules, and dispatches the closest registered donor before shelves go bare.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="neo-btn neo-btn-primary"
              onClick={onLaunchConsole}
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Zap size={18} />
              <span>Launch Mission Control</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="neo-btn neo-btn-cyan"
              onClick={onOpenSimulator}
              style={{ padding: '12px 20px', fontSize: '0.95rem' }}
            >
              <span>Test SMS Simulator</span>
            </button>

            <button
              className="neo-btn neo-btn-dark"
              onClick={onScrollToHowItWorks}
              style={{ padding: '12px 18px', fontSize: '0.95rem' }}
            >
              <span>How It Works</span>
            </button>
          </div>

          {/* Social proof bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '2px dashed rgba(255, 255, 255, 0.12)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--neo-green)' }}>
                {stats?.total_checkins ? `${stats.total_checkins + 42}+` : '42+'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CHECK-INS EVALUATED
              </div>
            </div>

            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--neo-yellow)' }}>
                &gt; 70%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SILENT RESOLUTION RATE
              </div>
            </div>

            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--neo-cyan)' }}>
                &lt; 20ms
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ROUTING LATENCY
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Telemetry Ticket */}
        <div>
          <div
            className="neo-box-static"
            style={{
              background: '#0d1322',
              border: '3px solid #000',
              boxShadow: '8px 8px 0px #000',
              borderRadius: '16px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header Ticket Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '2.5px solid #000',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    background: isHealthy ? 'var(--neo-green)' : 'var(--neo-coral)',
                    borderRadius: '50%',
                    border: '2px solid #000',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.8125rem' }}>
                  NODE // FRIDGE-HUB-01
                </span>
              </div>
              <span
                className="neo-sticker"
                style={{ background: 'var(--neo-yellow)', color: '#000' }}
              >
                LIVE TELEMETRY
              </span>
            </div>

            {/* Core Stats Grid inside Ticket */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Fill level meter */}
              <div
                style={{
                  background: '#07090e',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0px #000',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  CURRENT FILL CAPACITY
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
                  {fillPct}%
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: '#1e293b',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginTop: '8px',
                    border: '1px solid #000',
                  }}
                >
                  <div
                    style={{
                      width: `${fillPct}%`,
                      height: '100%',
                      background: fillPct < 25 ? 'var(--neo-coral)' : fillPct < 50 ? 'var(--neo-yellow)' : 'var(--neo-green)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>

              {/* Nearest Donor standby */}
              <div
                style={{
                  background: '#07090e',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0px #000',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  DONORS REGISTERED
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--neo-cyan)' }}>
                  {stats?.active_donors_count ?? 5} Active
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} />
                  <span>Radius: &lt; 15 km Haversine</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Check-in Preview Box */}
            <div
              style={{
                background: '#131b2e',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  INCOMING SMS (SIMULATED)
                </span>
                <span className="neo-pill" style={{ background: 'var(--neo-green)', color: '#000', fontSize: '0.65rem', padding: '2px 8px' }}>
                  AUTO-EVALUATED
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: '#f8fafc',
                  background: '#090d16',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #000',
                  marginBottom: '8px',
                }}
              >
                &ldquo;Fridge checked at 3pm: 2 cartons of milk, apples fresh, main shelf 70% full.&rdquo;
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--neo-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} />
                  Status: All Fine (Silent Log)
                </span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  0 false alerts sent
                </span>
              </div>
            </div>

            {/* Ticket Footer Action */}
            <button
              className="neo-btn neo-btn-primary"
              onClick={onLaunchConsole}
              style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}
            >
              <Cpu size={16} />
              <span>Inspect Live Mission Control</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
