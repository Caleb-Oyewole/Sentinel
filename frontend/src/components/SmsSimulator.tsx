import React, { useState } from 'react';
import { Send, Smartphone, Sparkles, AlertCircle } from 'lucide-react';
import type { CheckinExecutionResult } from '../services/api';
import { submitCheckin, submitWebhookSms } from '../services/api';
import confetti from 'canvas-confetti';

interface SmsSimulatorProps {
  onCheckinComplete: (result: CheckinExecutionResult) => void;
}

const PRESETS = [
  {
    id: 'spoilage',
    title: 'Spoilage Alert',
    badge: 'Risk',
    badgeClass: 'badge-rose',
    text: 'Milk smells bad and expired yesterday',
    expected: 'alert_pull (Volunteer SMS to pull)',
  },
  {
    id: 'empty',
    title: 'Critically Empty',
    badge: 'Empty',
    badgeClass: 'badge-amber',
    text: 'The main shelf is completely empty!',
    expected: 'alert_empty (Nearest Donor Dispatched)',
  },
  {
    id: 'nominal',
    title: 'Nominal Check-in',
    badge: 'All Fine',
    badgeClass: 'badge-emerald',
    text: 'Checked fridge, fully stocked and clean',
    expected: 'log_ok (Silent resolution)',
  },
  {
    id: 'produce',
    title: 'Near Expiry Produce',
    badge: 'Risk',
    badgeClass: 'badge-rose',
    text: 'Spinach and bread look spoiled and moldy',
    expected: 'alert_pull (Shelf-life check & pull)',
  },
];

export const SmsSimulator: React.FC<SmsSimulatorProps> = ({ onCheckinComplete }) => {
  const [inputText, setInputText] = useState('Milk smells bad and expired yesterday');
  const [senderPhone, setSenderPhone] = useState('+15554329876');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<CheckinExecutionResult | null>(null);
  const [rawTwiml, setRawTwiml] = useState<string | null>(null);
  const [executionMode, setExecutionMode] = useState<'api' | 'webhook'>('api');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setErrorMsg(null);
    setRawTwiml(null);

    try {
      if (executionMode === 'api') {
        const result = await submitCheckin(inputText.trim(), senderPhone.trim());
        setLastResponse(result);
        onCheckinComplete(result);

        if (result.status === 'all_fine') {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
        }
      } else {
        // Raw Twilio Webhook mode
        const twiml = await submitWebhookSms(inputText.trim(), senderPhone.trim());
        setRawTwiml(twiml);
        
        const syntheticResult: CheckinExecutionResult = {
          id: `webhook_${Date.now()}`,
          incoming_text: inputText.trim(),
          sender: senderPhone.trim(),
          status: twiml.includes('Sentinel Alert') ? (twiml.includes('donor') ? 'critically_empty' : 'risk') : 'all_fine',
          assessment_reasoning: 'Evaluated via Twilio Webhook Protocol POST /webhook/sms',
          extracted_data: {
            raw_text: inputText.trim(),
            items: [],
            freshness_signal: 'evaluated',
            fill_level: 'evaluated',
          },
          action_taken: twiml.includes('Sentinel Alert') ? twiml : 'Logged silently via TwiML.',
          timestamp: new Date().toISOString(),
          source: 'webhook',
        };
        setLastResponse(syntheticResult);
        onCheckinComplete(syntheticResult);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing check-in');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '10px', color: '#06b6d4' }}>
            <Smartphone size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
              Live SMS & Check-in Console
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Simulate volunteer check-ins or real Twilio SMS incoming webhooks
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className={`btn ${executionMode === 'api' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={() => setExecutionMode('api')}
          >
            Graph API
          </button>
          <button
            type="button"
            className={`btn ${executionMode === 'webhook' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={() => setExecutionMode('webhook')}
          >
            Twilio TwiML
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={12} color="#f59e0b" />
          <span>QUICK-TEST SCENARIOS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {PRESETS.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelectPreset(p.text)}
              style={{
                background: inputText === p.text ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: inputText === p.text ? '1px solid #06b6d4' : '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{p.title}</span>
                <span className={`badge ${p.badgeClass}`} style={{ fontSize: '0.625rem', padding: '2px 6px' }}>
                  {p.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{p.text}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="phone-mockup">
        <div className="phone-speaker" />

        <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Virtual Phone Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                S
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Sentinel Hub SMS</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Twilio Webhook Node</div>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.625rem' }}>200 OK</span>
          </div>

          {/* Chat Messages */}
          <div style={{ minHeight: '130px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'flex-end' }}>
            <div className="chat-bubble-received">
              Welcome to Sentinel Community Fridge. Text your report or item shelf check-in.
            </div>

            {lastResponse && (
              <>
                <div className="chat-bubble-sent">
                  {lastResponse.incoming_text}
                </div>
                <div 
                  className="chat-bubble-received" 
                  style={{ 
                    borderLeft: `3px solid ${lastResponse.status === 'risk' ? '#f43f5e' : lastResponse.status === 'critically_empty' ? '#f59e0b' : '#10b981'}` 
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '4px', color: lastResponse.status === 'risk' ? '#fb7185' : lastResponse.status === 'critically_empty' ? '#fbbf24' : '#34d399' }}>
                    Sentinel Action:
                  </div>
                  <div>{lastResponse.action_taken}</div>
                  {lastResponse.notified_donor && (
                    <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#38bdf8' }}>
                      Restock Volunteer Alerted: <strong>{lastResponse.notified_donor}</strong>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="Sender Phone (+1...)"
                style={{
                  width: '120px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type incoming check-in text..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !inputText.trim()}
                style={{ padding: '8px 14px' }}
              >
                {loading ? <div className="pulse-dot pulse-dot-emerald" /> : <Send size={16} />}
              </button>
            </div>
          </form>

          {/* Raw TwiML view if in webhook mode */}
          {rawTwiml && (
            <div style={{ background: '#05070c', padding: '8px', borderRadius: '8px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', maxHeight: '70px', overflowY: 'auto' }}>
              <div style={{ color: '#06b6d4', marginBottom: '2px' }}>&lt;Response&gt; TwiML:</div>
              {rawTwiml}
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontSize: '0.75rem' }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
