import React, { useState } from 'react';
import {
  AlertTriangle,
  Package,
  BellOff,
  Cpu,
  MapPin,
  Database,
  Smartphone,
  ShieldCheck,
  Activity,
  Play,
  Layers,
} from 'lucide-react';
import { processCheckin } from '../services/api';
import type { CheckinExecutionResult } from '../services/api';

interface LandingBodyProps {
  onNavigateToConsoleTab: (tab: 'dashboard' | 'pipeline' | 'radar' | 'shelflife') => void;
}

export const LandingBody: React.FC<LandingBodyProps> = ({ onNavigateToConsoleTab }) => {
  // Interactive sandbox state
  const [sandboxInput, setSandboxInput] = useState('Milk smells bad and expired yesterday');
  const [sandboxExecuting, setSandboxExecuting] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<CheckinExecutionResult | null>(null);

  const handleRunSandbox = async (presetText?: string) => {
    const textToRun = presetText || sandboxInput;
    if (!textToRun.trim()) return;
    setSandboxExecuting(true);
    try {
      const res = await processCheckin(textToRun, '+15559876543');
      setSandboxResult(res);
    } catch (err) {
      console.error('Sandbox run failed:', err);
    } finally {
      setSandboxExecuting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* 1. CONTINUOUS MARQUEE TICKER TAPE */}
      <div className="marquee-container">
        <div className="marquee-content">
          SENTINEL MUTUAL AID AI &nbsp;•&nbsp; DUAL-LAYER STRANDS ENGINE &nbsp;•&nbsp; ZERO FOOD WASTE &nbsp;•&nbsp; HYPERLOCAL HAVERSINE DISPATCH &nbsp;•&nbsp; AUTOMATED TWILIO SMS &nbsp;•&nbsp; VERIFIED SHELF-LIFE DATABASE &nbsp;•&nbsp; 100% OPEN SOURCE &nbsp;•&nbsp; PROTECTING COMMUNITY FRIDGES &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div className="marquee-content" aria-hidden="true">
          SENTINEL MUTUAL AID AI &nbsp;•&nbsp; DUAL-LAYER STRANDS ENGINE &nbsp;•&nbsp; ZERO FOOD WASTE &nbsp;•&nbsp; HYPERLOCAL HAVERSINE DISPATCH &nbsp;•&nbsp; AUTOMATED TWILIO SMS &nbsp;•&nbsp; VERIFIED SHELF-LIFE DATABASE &nbsp;•&nbsp; 100% OPEN SOURCE &nbsp;•&nbsp; PROTECTING COMMUNITY FRIDGES &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      {/* 2. THE PROBLEM VS SOLUTION SECTION */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="neo-pill" style={{ background: 'var(--neo-coral)', color: '#fff' }}>
            THE COMMUNITY FRIDGE DILEMMA
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginTop: '0.75rem',
            }}
          >
            Why Community Fridges Fail &mdash; And How Sentinel Fixes It
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>
            Grassroots fridges rely on informal volunteer WhatsApp or Discord threads. Important spoilage
            goes unnoticed, shelves sit empty for days, and volunteer organizers burn out from message fatigue.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div className="neo-box" style={{ padding: '1.75rem', background: '#0e1422' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--neo-coral)',
                border: '2px solid #000',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              1. Silent Spoilage Danger
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Donated items without clear labels (like opened milk or wilted greens) spoil silently. Community
              members risk foodborne illness when safety checks aren&apos;t standardized.
            </p>
            <div
              style={{
                background: 'rgba(255, 67, 101, 0.12)',
                border: '1.5px solid var(--neo-coral)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.8125rem',
                color: '#fecdd3',
                fontWeight: 600,
              }}
            >
              <strong>Sentinel Solution:</strong> Dynamic shelf-life verification triggers instant volunteer SMS pull alerts within milliseconds.
            </div>
          </div>

          {/* Card 2 */}
          <div className="neo-box" style={{ padding: '1.75rem', background: '#0e1422' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--neo-yellow)',
                border: '2px solid #000',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                marginBottom: '1rem',
              }}
            >
              <Package size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              2. The Empty Fridge Blindspot
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              When a fridge is cleaned out, it often sits empty for 24-48 hours before anyone notices.
              Neighbors in urgent need arrive at an empty box.
            </p>
            <div
              style={{
                background: 'rgba(255, 230, 0, 0.12)',
                border: '1.5px solid var(--neo-yellow)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.8125rem',
                color: '#fef08a',
                fontWeight: 600,
              }}
            >
              <strong>Sentinel Solution:</strong> Under 20% fill level automatically alerts the geometrically closest registered donor to restock.
            </div>
          </div>

          {/* Card 3 */}
          <div className="neo-box" style={{ padding: '1.75rem', background: '#0e1422' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--neo-green)',
                border: '2px solid #000',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                marginBottom: '1rem',
              }}
            >
              <BellOff size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              3. Volunteer Alert Fatigue
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Broadcasting every check-in creates notification fatigue. Volunteers eventually mute group chats,
              leading to missed genuine emergencies.
            </p>
            <div
              style={{
                background: 'rgba(0, 245, 155, 0.12)',
                border: '1.5px solid var(--neo-green)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.8125rem',
                color: '#a7f3d0',
                fontWeight: 600,
              }}
            >
              <strong>Sentinel Solution:</strong> Over 70% of nominal check-ins are logged silently without disturbing human volunteers.
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 4-STEP PIPELINE */}
      <section
        id="how-it-works"
        style={{
          background: '#090d16',
          borderTop: '2.5px solid #000',
          borderBottom: '2.5px solid #000',
          padding: '4rem 1rem',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="neo-pill" style={{ background: 'var(--neo-cyan)', color: '#000' }}>
              AUTONOMOUS LOOP WORKFLOW
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                marginTop: '0.75rem',
              }}
            >
              How Sentinel Operates in 4 Autonomous Steps
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              From incoming natural-language SMS to automated dispatch in less than 20 milliseconds.
            </p>
          </div>

          <div className="pipeline-flow-container">
            {/* Step 1 */}
            <div className="neo-box" style={{ padding: '1.5rem', background: '#0e1424' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="neo-sticker" style={{ background: 'var(--neo-yellow)', color: '#000' }}>
                  STEP 01
                </span>
                <Smartphone size={20} color="var(--neo-yellow)" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Volunteer SMS Intake
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                A volunteer visiting the fridge texts a natural note via Twilio (e.g. &quot;Fridge 80% full, milk smells sour&quot;).
              </p>
            </div>

            {/* Step 2 */}
            <div className="neo-box" style={{ padding: '1.5rem', background: '#0e1424' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="neo-sticker" style={{ background: 'var(--neo-cyan)', color: '#000' }}>
                  STEP 02
                </span>
                <Cpu size={20} color="var(--neo-cyan)" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                AI &amp; Shelf-Life Verification
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                Strands reasoning agent cross-references mentioned items against verified food safety profiles and thresholds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="neo-box" style={{ padding: '1.5rem', background: '#0e1424' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="neo-sticker" style={{ background: 'var(--neo-green)', color: '#000' }}>
                  STEP 03
                </span>
                <Layers size={20} color="var(--neo-green)" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Autonomous Decision
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                Routes to one of three deterministic branches: <code>risk</code> (pull), <code>critically_empty</code> (restock), or <code>all_fine</code> (silent log).
              </p>
            </div>

            {/* Step 4 */}
            <div className="neo-box" style={{ padding: '1.5rem', background: '#0e1424' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="neo-sticker" style={{ background: 'var(--neo-coral)', color: '#fff' }}>
                  STEP 04
                </span>
                <MapPin size={20} color="var(--neo-coral)" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Haversine Dispatch
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                If empty, computes the exact geographical closest donor from the roster and sends a personalized SMS restock request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SANDBOX TEST DRIVE */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
        <div
          className="neo-box-static"
          style={{
            background: '#0d1322',
            border: '3px solid #000',
            boxShadow: '8px 8px 0px #000',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="neo-sticker" style={{ background: 'var(--neo-yellow)', color: '#000', marginBottom: '6px' }}>
                INTERACTIVE SANDBOX
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900 }}>
                Test Drive the Autonomous Evaluation Engine
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Select a preset scenario below or type a check-in note to watch Sentinel classify it in real-time.
              </p>
            </div>

            <button
              className="neo-btn neo-btn-cyan"
              onClick={() => onNavigateToConsoleTab('dashboard')}
              style={{ fontSize: '0.8125rem', padding: '8px 14px' }}
            >
              <span>Open Full Simulator →</span>
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <button
              className="neo-btn neo-btn-dark"
              onClick={() => {
                setSandboxInput('Raw poultry smells off and expired yesterday');
                handleRunSandbox('Raw poultry smells off and expired yesterday');
              }}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Scenario A: Spoilage Alert
            </button>

            <button
              className="neo-btn neo-btn-dark"
              onClick={() => {
                setSandboxInput('Main shelf is completely empty, 10% remaining');
                handleRunSandbox('Main shelf is completely empty, 10% remaining');
              }}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Scenario B: Empty Restock
            </button>

            <button
              className="neo-btn neo-btn-dark"
              onClick={() => {
                setSandboxInput('Checked fridge: 20 apples, carrots fresh, 85% full');
                handleRunSandbox('Checked fridge: 20 apples, carrots fresh, 85% full');
              }}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Scenario C: Silent Normal Log
            </button>
          </div>

          {/* Input & Run row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder="e.g. Milk smells bad, lettuce is slimy..."
              style={{
                flex: 1,
                minWidth: '260px',
                background: '#07090e',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              className="neo-btn neo-btn-primary"
              onClick={() => handleRunSandbox()}
              disabled={sandboxExecuting}
              style={{ padding: '10px 20px', minWidth: '130px' }}
            >
              <Play size={16} />
              <span>{sandboxExecuting ? 'Evaluating...' : 'Run Test'}</span>
            </button>
          </div>

          {/* Execution Result Box */}
          {sandboxResult && (
            <div
              className="neo-box"
              style={{
                background: '#080c14',
                padding: '1.25rem',
                border: '2px solid #000',
                borderRadius: '10px',
                boxShadow: '4px 4px 0px #000',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="neo-pill"
                    style={{
                      background:
                        sandboxResult.status === 'risk'
                          ? 'var(--neo-coral)'
                          : sandboxResult.status === 'critically_empty'
                          ? 'var(--neo-yellow)'
                          : 'var(--neo-green)',
                      color: sandboxResult.status === 'risk' ? '#fff' : '#000',
                    }}
                  >
                    STATUS: {sandboxResult.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ID: {sandboxResult.id}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--neo-cyan)', fontFamily: 'var(--font-mono)' }}>
                  Executed in {sandboxResult.execution_time_ms} ms
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#e2e8f0', marginBottom: '8px' }}>
                <strong>Reasoning:</strong> {sandboxResult.assessment_reasoning}
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <strong>Action Taken:</strong>{' '}
                <span style={{ color: 'var(--neo-green)', fontWeight: 600 }}>{sandboxResult.action_taken}</span>
                {sandboxResult.notified_donor && (
                  <span> &mdash; Dispatched nearest donor: <strong>{sandboxResult.notified_donor}</strong></span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. 6-CARD ARCHITECTURAL PILLARS */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="neo-pill" style={{ background: 'var(--neo-purple)', color: '#fff' }}>
            ENGINEERING SPECIFICATIONS
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              marginTop: '0.75rem',
            }}
          >
            Built for Real-World Autonomous Mutual Aid
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            A lightweight, production-hardened tech stack engineered for reliability in high-stakes community infrastructure.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="neo-box" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--neo-yellow)',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                marginBottom: '1rem',
              }}
            >
              <Cpu size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Strands Multi-Agent Graph
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              5-node state graph orchestrating intake parsing, shelf-life tool retrieval, structured triage, and automated branch dispatches.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="neo-box" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--neo-cyan)',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                marginBottom: '1rem',
              }}
            >
              <MapPin size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Haversine Proximity Dispatch
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Calculates real-world great-circle geographical distance between the fridge coordinates and registered donors, contacting the nearest provider.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="neo-box" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--neo-green)',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                marginBottom: '1rem',
              }}
            >
              <Database size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Verified Shelf-Life Database
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Over 20 food categories mapped with typical refrigeration shelf-life days and recognized spoilage signals (wilting, sliminess, mold, odor).
            </p>
          </div>

          {/* Feature 4 */}
          <div className="neo-box" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--neo-coral)',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              <Smartphone size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Two-Way Twilio SMS Webhook
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Zero app install required. Volunteers text any regular cell phone number to trigger the webhook and receive instant TwiML confirmation.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="neo-box" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--neo-purple)',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Fail-Safe Fallback Matrix
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Deterministic local heuristics ensure the system remains 100% operational even if external cloud LLM APIs experience rate limits or outages.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="neo-box" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#ff9900',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                marginBottom: '1rem',
              }}
            >
              <Activity size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Real-Time Mission Telemetry
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Live audit logging, aggregate capacity HUDs, donor radar positioning, and immediate visual agent execution traces.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
        <div
          className="neo-box-yellow"
          style={{
            padding: '3rem 2rem',
            borderRadius: '16px',
            boxShadow: '8px 8px 0px #000',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <span className="neo-sticker" style={{ background: '#000', color: 'var(--neo-yellow)', fontSize: '0.8125rem' }}>
            COMMUNITY AID IN ACTION
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#000',
              maxWidth: '780px',
            }}
          >
            Ready to Protect Your Neighborhood Fridge Network?
          </h2>
          <p style={{ color: '#1f2937', fontSize: '1.05rem', fontWeight: 600, maxWidth: '620px' }}>
            Explore the live operations dashboard, run simulations, register local food donors, or test the shelf-life rulebook right now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="neo-btn neo-btn-dark"
              onClick={() => onNavigateToConsoleTab('dashboard')}
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              <span>Launch Live Console →</span>
            </button>
            <button
              className="neo-btn"
              onClick={() => onNavigateToConsoleTab('radar')}
              style={{ background: '#fff', color: '#000', padding: '12px 24px', fontSize: '1rem' }}
            >
              <span>Inspect Donor Radar</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
