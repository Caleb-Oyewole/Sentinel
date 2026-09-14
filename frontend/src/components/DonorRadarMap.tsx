import React, { useState } from 'react';
import { UserPlus, Phone, Radar } from 'lucide-react';
import type { Donor } from '../services/api';
import { createDonor } from '../services/api';

interface DonorRadarMapProps {
  donors: Donor[];
  notifiedDonorName?: string | null;
  onDonorAdded: () => void;
}

export const DonorRadarMap: React.FC<DonorRadarMapProps> = ({ donors, notifiedDonorName, onDonorAdded }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState('6.5260');
  const [lon, setLon] = useState('3.3770');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fridge GPS Coordinates (Lagos Island / Yaba Community Hub)
  const fridgeCoord = { lat: 6.5244, lon: 3.3792 };

  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSaving(true);
    setError(null);

    try {
      await createDonor({
        name,
        phone,
        lat: parseFloat(lat) || 6.5244,
        lon: parseFloat(lon) || 3.3792,
      });
      setName('');
      setPhone('');
      setShowAddModal(false);
      onDonorAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add donor');
    } finally {
      setSaving(false);
    }
  };

  // Convert lat/lon relative to fridge into SVG 2D plane coordinates
  const getSvgPos = (dLat: number, dLon: number) => {
    const scale = 14000;
    const cx = 200;
    const cy = 200;
    const x = cx + (dLon - fridgeCoord.lon) * scale;
    const y = cy - (dLat - fridgeCoord.lat) * scale;
    return { x: Math.max(30, Math.min(370, x)), y: Math.max(30, Math.min(370, y)) };
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981' }}>
            <Radar size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
              Geo-Spatial Donor Radar (Haversine Restock)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Sentinel automatically computes distance and routes restock alerts to the nearest volunteer
            </p>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
          onClick={() => setShowAddModal(!showAddModal)}
        >
          <UserPlus size={14} />
          <span>Add Donor</span>
        </button>
      </div>

      {/* Modal / Inline Add Donor Form */}
      {showAddModal && (
        <form onSubmit={handleAddDonor} style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#38bdf8' }}>Register New Food Restock Donor</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
            <input
              type="text"
              placeholder="Name (e.g. Samuel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px', color: '#fff', fontSize: '0.8125rem' }}
            />
            <input
              type="text"
              placeholder="Phone (+1234567895)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px', color: '#fff', fontSize: '0.8125rem' }}
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px', color: '#fff', fontSize: '0.8125rem' }}
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px', color: '#fff', fontSize: '0.8125rem' }}
            />
          </div>
          {error && <div style={{ color: '#fb7185', fontSize: '0.75rem' }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
              {saving ? 'Saving...' : 'Register Donor'}
            </button>
          </div>
        </form>
      )}

      {/* Interactive Radar Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 400px) 1fr', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#090e17', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
            {/* Concentric distance rings */}
            <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
            <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />

            {/* Radar Crosshairs */}
            <line x1="200" y1="15" x2="200" y2="385" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
            <line x1="15" y1="200" x2="385" y2="200" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />

            {/* Radar Sweeping Beam */}
            <g className="radar-sweep">
              <path d="M 200 200 L 385 200 A 185 185 0 0 0 330 70 Z" fill="url(#radarGradient)" />
            </g>

            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.35)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
              </linearGradient>
            </defs>

            {/* Sentinel Community Fridge Center Node */}
            <circle cx="200" cy="200" r="10" fill="#10b981" filter="drop-shadow(0 0 8px #10b981)" />
            <circle cx="200" cy="200" r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" className="animate-ping" />
            <text x="200" y="225" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
              FRIDGE (0 km)
            </text>

            {/* Donor Nodes */}
            {donors.map((donor) => {
              const pos = getSvgPos(donor.lat, donor.lon);
              const isDispatched = notifiedDonorName === donor.name;

              return (
                <g key={donor.id} className={isDispatched ? 'marker-highlight' : ''}>
                  {/* Connection Line to Fridge if Dispatched */}
                  {isDispatched && (
                    <line
                      x1="200"
                      y1="200"
                      x2={pos.x}
                      y2={pos.y}
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                  )}

                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isDispatched ? 9 : 6}
                    fill={isDispatched ? '#f59e0b' : '#38bdf8'}
                    filter={isDispatched ? 'drop-shadow(0 0 10px #f59e0b)' : 'drop-shadow(0 0 5px #38bdf8)'}
                  />

                  <text
                    x={pos.x}
                    y={pos.y - 10}
                    textAnchor="middle"
                    fill={isDispatched ? '#fbbf24' : '#94a3b8'}
                    fontSize="9"
                    fontWeight={isDispatched ? 'bold' : 'normal'}
                    fontFamily="monospace"
                  >
                    {donor.name} ({donor.distance_km?.toFixed(2)} km)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Donors Roster Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            REGISTERED DONORS (SORTED BY DISTANCE)
          </div>

          {donors.map((donor, idx) => {
            const isNotified = notifiedDonorName === donor.name;
            return (
              <div
                key={donor.id}
                style={{
                  background: isNotified ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isNotified ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isNotified ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isNotified ? '#f59e0b' : '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{donor.name}</span>
                      {isNotified && (
                        <span className="badge badge-amber" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>
                          DISPATCHED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Phone size={11} />
                      <span>{donor.phone}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: '#34d399' }}>
                    {donor.distance_km !== undefined ? `${donor.distance_km.toFixed(2)} km` : '--'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {donor.distance_miles !== undefined ? `${donor.distance_miles.toFixed(2)} mi` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
