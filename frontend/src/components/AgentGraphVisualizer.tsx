import React from 'react';
import { GitFork, Cpu, ShieldAlert, Truck, Check, Database, FileText } from 'lucide-react';
import type { CheckinExecutionResult } from '../services/api';

interface AgentGraphVisualizerProps {
  lastExecution: CheckinExecutionResult | null;
}

export const AgentGraphVisualizer: React.FC<AgentGraphVisualizerProps> = ({ lastExecution }) => {
  const status = lastExecution?.status;

  const isIntakeActive = Boolean(lastExecution);
  const isAgentActive = Boolean(lastExecution);
  const isToolActive = Boolean(lastExecution?.extracted_data?.items?.length);

  const isPullActive = status === 'risk';
  const isEmptyActive = status === 'critically_empty';
  const isOkActive = status === 'all_fine';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '10px', color: '#a78bfa' }}>
            <Cpu size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
              Strands AI Graph Pipeline
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Autonomous 5-Node Agentic Decision & Routing Architecture
            </p>
          </div>
        </div>

        {lastExecution && (
          <div className={`badge ${status === 'risk' ? 'badge-rose' : status === 'critically_empty' ? 'badge-amber' : 'badge-emerald'}`}>
            <span className={`pulse-dot ${status === 'risk' ? 'pulse-dot-rose' : status === 'critically_empty' ? 'pulse-dot-amber' : 'pulse-dot-emerald'}`} />
            <span>ROUTE: {status ? status.toUpperCase() : 'IDLE'}</span>
          </div>
        )}
      </div>

      {/* Visual Pipeline Flow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', position: 'relative' }}>
        {/* Node 1: Intake */}
        <div className={`pipeline-node ${isIntakeActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <FileText size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>1. Intake Node</span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            Parses SMS text, extracts items & signals
          </p>
          {lastExecution && (
            <div style={{ marginTop: '8px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              Items: {lastExecution.extracted_data.items.join(', ') || 'None explicit'}
            </div>
          )}
        </div>

        {/* Node 2: Shelf-Life Tool */}
        <div className={`pipeline-node ${isToolActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Database size={16} color="#10b981" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>2. Shelf-Life Tool</span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            USDA / Safe food rule database lookup
          </p>
          {lastExecution && (
            <div style={{ marginTop: '8px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
              Signal: {lastExecution.extracted_data.freshness_signal}
            </div>
          )}
        </div>

        {/* Node 3: Strands Assessment Agent */}
        <div className={`pipeline-node ${isAgentActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Cpu size={16} color="#a78bfa" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>3. Strands Agent</span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            LLM assessment & structured validation
          </p>
          {lastExecution && (
            <div style={{ marginTop: '8px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#c084fc' }}>
              Status: {lastExecution.status}
            </div>
          )}
        </div>

        {/* Node 4: Dynamic Router */}
        <div className={`pipeline-node ${isAgentActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <GitFork size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>4. Smart Router</span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            Branch selector via state evaluation
          </p>
          {lastExecution && (
            <div style={{ marginTop: '8px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
              Branch: {status === 'risk' ? 'alert_pull' : status === 'critically_empty' ? 'alert_empty' : 'log_ok'}
            </div>
          )}
        </div>

        {/* Node 5: Destination Node */}
        <div className={`pipeline-node ${isPullActive ? 'active-risk' : isEmptyActive ? 'active-warn' : isOkActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {isPullActive ? (
              <ShieldAlert size={16} color="#fb7185" />
            ) : isEmptyActive ? (
              <Truck size={16} color="#fbbf24" />
            ) : (
              <Check size={16} color="#34d399" />
            )}
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>5. Resolution</span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            {isPullActive ? 'Volunteer pull alert' : isEmptyActive ? 'Haversine donor restock' : 'Silent OK log'}
          </p>
          {lastExecution && (
            <div style={{ marginTop: '8px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lastExecution.action_taken}
            </div>
          )}
        </div>
      </div>

      {/* Agent Reasoning Breakdown */}
      {lastExecution && (
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
            STRANDS AGENT REASONING EXPLANATION:
          </div>
          <p style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{lastExecution.assessment_reasoning}"
          </p>
        </div>
      )}
    </div>
  );
};
