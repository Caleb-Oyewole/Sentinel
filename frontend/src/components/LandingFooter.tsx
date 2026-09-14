import React, { useState } from 'react';
import { Shield, Send } from 'lucide-react';
import type { HealthResponse } from '../services/api';

interface LandingFooterProps {
  health: HealthResponse | null;
  onNavigateTab: (tab: 'dashboard' | 'pipeline' | 'radar' | 'shelflife') => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ health, onNavigateTab }) => {
  const [pledgeEmail, setPledgeEmail] = useState('');
  const [pledged, setPledged] = useState(false);

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeEmail.trim()) return;
    setPledged(true);
    setTimeout(() => {
      setPledgeEmail('');
    }, 3000);
  };

  const isHealthy = health?.status === 'healthy';

  return (
    <footer className="landing-footer">
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '3.5rem 1.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'var(--neo-yellow)',
                  border: '2px solid #000',
                  boxShadow: '2px 2px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                }}
              >
                <Shield size={20} strokeWidth={2.8} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900 }}>
                SENTINEL
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Autonomous mutual aid intelligence layer for neighborhood community fridges. Zero spoilage, zero empty shelves, and respectful silent logging for human volunteers.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="neo-pill" style={{ background: '#1e293b', color: '#94a3b8' }}>
                MIT LICENSE
              </span>
              <span className="neo-pill" style={{ background: 'var(--neo-green)', color: '#000' }}>
                OPEN SOURCE
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: 'var(--neo-yellow)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Console Views
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    padding: 0,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  &rarr; Mission Control Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('pipeline')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    padding: 0,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  &rarr; Strands Multi-Agent Graph
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('radar')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    padding: 0,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  &rarr; Haversine Donor Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('shelflife')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    padding: 0,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  &rarr; Shelf-Life Rules Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: API Reference */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: 'var(--neo-cyan)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Live API Endpoints
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a
                  href="/health"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neo-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  GET /health
                </a>
              </li>
              <li>
                <a
                  href="/api/stats"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neo-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  GET /api/stats
                </a>
              </li>
              <li>
                <a
                  href="/api/donors"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neo-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  GET /api/donors
                </a>
              </li>
              <li>
                <a
                  href="/api/shelflife"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neo-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  GET /api/shelflife
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Volunteer Pledge Signup */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: 'var(--neo-green)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Join the Network
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Pledge food donations or sign up as a local community fridge monitor.
            </p>

            {pledged ? (
              <div
                className="neo-box-green"
                style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 800 }}
              >
                PLEDGED AS A SENTINEL ALLY
              </div>
            ) : (
              <form onSubmit={handlePledge} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="email"
                  value={pledgeEmail}
                  onChange={(e) => setPledgeEmail(e.target.value)}
                  placeholder="volunteer@mutualaid.org"
                  required
                  style={{
                    background: '#07090e',
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0px #000',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="neo-btn neo-btn-green"
                  style={{ padding: '8px 14px', fontSize: '0.75rem', width: '100%' }}
                >
                  <Send size={13} />
                  <span>Submit Pledge</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '2px solid #000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} SENTINEL &bull; AUTONOMOUS COMMUNITY FRIDGE DEFENSE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isHealthy ? 'var(--neo-green)' : 'var(--neo-coral)',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: isHealthy ? 'var(--neo-green)' : 'var(--neo-coral)', fontWeight: 700 }}>
                {isHealthy ? 'SYSTEM OPERATIONAL' : 'OFFLINE'}
              </span>
            </div>

            <span>&bull;</span>

            <a
              href="https://github.com/Caleb-Oyewole/Sentinel"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
