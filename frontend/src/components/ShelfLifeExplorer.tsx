import React, { useState } from 'react';
import { Search, Database, Tag } from 'lucide-react';
import type { ShelfLifeData } from '../services/api';

interface ShelfLifeExplorerProps {
  shelfLife: ShelfLifeData | null;
}

export const ShelfLifeExplorer: React.FC<ShelfLifeExplorerProps> = ({ shelfLife }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const items = shelfLife?.items || {};
  const aliases = shelfLife?.aliases || {};

  const allKeys = Object.keys(items);
  const filteredKeys = allKeys.filter((key) => {
    const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.entries(aliases).some(([alias, target]) => target === key && alias.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '10px', color: '#06b6d4' }}>
            <Database size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
              Food Safety & Shelf-Life Matrix
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Sentinel Strands agent uses these calibrated thresholds to classify safe vs spoilage food check-ins
            </p>
          </div>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search item (milk, rice, beef)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 12px 6px 32px',
              color: '#fff',
              fontSize: '0.8125rem',
            }}
          />
        </div>
      </div>

      {/* Grid of Shelf Life Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredKeys.map((key) => {
          const info = items[key] || {};
          const matchedAliases = Object.entries(aliases)
            .filter(([, target]) => target === key)
            .map(([alias]) => alias);

          return (
            <div
              key={key}
              style={{
                background: '#0d1322',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, textTransform: 'capitalize', color: '#f1f5f9' }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.625rem' }}>
                  Verified Rule
                </span>
              </div>

              {/* Storage durations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '4px 0' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>PANTRY</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                    {info.days_at_room_temp !== undefined ? `${info.days_at_room_temp}d` : '--'}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>FRIDGE</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {info.days_refrigerated !== undefined ? `${info.days_refrigerated}d` : '--'}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>FREEZER</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {info.days_frozen !== undefined ? `${info.days_frozen}d` : '--'}
                  </div>
                </div>
              </div>

              {/* Tips / Notes */}
              {info.tips && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Tip: {info.tips}
                </div>
              )}

              {/* Aliases tags */}
              {matchedAliases.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '4px' }}>
                  <Tag size={10} color="var(--text-muted)" />
                  {matchedAliases.slice(0, 3).map((a) => (
                    <span key={a} style={{ fontSize: '0.625rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {a}
                    </span>
                  ))}
                  {matchedAliases.length > 3 && (
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                      +{matchedAliases.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
