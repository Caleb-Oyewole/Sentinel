import React from 'react';
import { History, Trash2, Clock, CheckCircle2, AlertOctagon, AlertTriangle, ArrowRight } from 'lucide-react';
import type { CheckinExecutionResult } from '../services/api';
import { clearHistory } from '../services/api';

interface ActivityLogProps {
  history: CheckinExecutionResult[];
  onHistoryCleared: () => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ history, onHistoryCleared }) => {
  const handleClear = async () => {
    if (!window.confirm('Clear all check-in session logs?')) return;
    try {
      await clearHistory();
      onHistoryCleared();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'risk') return <AlertOctagon size={16} color="#fb7185" />;
    if (status === 'critically_empty') return <AlertTriangle size={16} color="#fbbf24" />;
    return <CheckCircle2 size={16} color="#34d399" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '10px', color: '#38bdf8' }}>
            <History size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
              Live Telemetry & Audit Stream
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Chronological log of volunteer SMS reports and autonomous actions taken
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            className="btn btn-outline-danger"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={handleClear}
          >
            <Trash2 size={14} />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No check-ins recorded yet. Try running a scenario above or sending an SMS to see live logs!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
          {history.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getStatusIcon(item.status)}
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                    "{item.incoming_text}"
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${item.status === 'risk' ? 'badge-rose' : item.status === 'critically_empty' ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.625rem' }}>
                    {item.status}
                  </span>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                    <Clock size={11} />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowRight size={12} color="var(--text-muted)" />
                <span>Action: <strong>{item.action_taken}</strong></span>
                {item.notified_donor && (
                  <span style={{ color: '#fbbf24' }}>(Donor: {item.notified_donor})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
