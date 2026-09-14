import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { LandingBody } from './components/LandingBody';
import { LandingFooter } from './components/LandingFooter';
import { FridgeStatusHUD } from './components/FridgeStatusHUD';
import { SmsSimulator } from './components/SmsSimulator';
import { AgentGraphVisualizer } from './components/AgentGraphVisualizer';
import { DonorRadarMap } from './components/DonorRadarMap';
import { ShelfLifeExplorer } from './components/ShelfLifeExplorer';
import { ActivityLog } from './components/ActivityLog';
import {
  fetchHealth,
  fetchStats,
  fetchDonors,
  fetchShelfLife,
  fetchHistory,
} from './services/api';
import type {
  HealthResponse,
  StatsResponse,
  Donor,
  ShelfLifeData,
  CheckinExecutionResult,
} from './services/api';
import { LayoutDashboard, Cpu, Radar, Database, Sparkles, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'console'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'radar' | 'shelflife'>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [shelfLife, setShelfLife] = useState<ShelfLifeData | null>(null);
  const [history, setHistory] = useState<CheckinExecutionResult[]>([]);
  const [lastExecution, setLastExecution] = useState<CheckinExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [hRes, sRes, dRes, slRes, histRes] = await Promise.allSettled([
        fetchHealth(),
        fetchStats(),
        fetchDonors(),
        fetchShelfLife(),
        fetchHistory(),
      ]);

      if (hRes.status === 'fulfilled') setHealth(hRes.value);
      if (sRes.status === 'fulfilled') setStats(sRes.value);
      if (dRes.status === 'fulfilled') setDonors(dRes.value);
      if (slRes.status === 'fulfilled') setShelfLife(slRes.value);
      if (histRes.status === 'fulfilled') {
        setHistory(histRes.value);
        setLastExecution((prev) => (histRes.value.length > 0 && !prev ? histRes.value[0] : prev));
      }
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.allSettled([
      fetchHealth(),
      fetchStats(),
      fetchDonors(),
      fetchShelfLife(),
      fetchHistory(),
    ]).then(([hRes, sRes, dRes, slRes, histRes]) => {
      if (ignore) return;
      if (hRes.status === 'fulfilled') setHealth(hRes.value);
      if (sRes.status === 'fulfilled') setStats(sRes.value);
      if (dRes.status === 'fulfilled') setDonors(dRes.value);
      if (slRes.status === 'fulfilled') setShelfLife(slRes.value);
      if (histRes.status === 'fulfilled') {
        setHistory(histRes.value);
        setLastExecution((prev) => (histRes.value.length > 0 && !prev ? histRes.value[0] : prev));
      }
    });

    const interval = setInterval(() => {
      fetchStats().then(setStats).catch(() => {});
      fetchHistory().then(setHistory).catch(() => {});
    }, 5000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const handleCheckinComplete = (result: CheckinExecutionResult) => {
    setLastExecution(result);
    fetchStats().then(setStats).catch(() => {});
    fetchHistory().then((h) => setHistory(h)).catch(() => {});
  };

  const handleNavigateToTab = (tab: 'dashboard' | 'pipeline' | 'radar' | 'shelflife') => {
    setActiveTab(tab);
    setViewMode('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Neobrutalist Navigation */}
      <Navbar
        activeView={viewMode}
        onViewChange={setViewMode}
        health={health}
        loading={loading}
        onRefresh={loadAllData}
      />

      {/* VIEW 1: LANDING PAGE */}
      {viewMode === 'landing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <LandingHero
            stats={stats}
            health={health}
            onLaunchConsole={() => {
              setViewMode('console');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSimulator={() => {
              setActiveTab('dashboard');
              setViewMode('console');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onScrollToHowItWorks={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <LandingBody onNavigateToConsoleTab={handleNavigateToTab} />

          <LandingFooter health={health} onNavigateTab={handleNavigateToTab} />
        </div>
      )}

      {/* VIEW 2: LIVE MISSION CONTROL / OPERATIONAL CONSOLE */}
      {viewMode === 'console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Back to story bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              background: '#0d1322',
              borderRadius: '10px',
              border: '2px solid #000',
              boxShadow: '3px 3px 0px #000',
            }}
          >
            <button
              onClick={() => {
                setViewMode('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--neo-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>← Back to Overview &amp; Story</span>
            </button>

            <span
              className="neo-sticker"
              style={{ background: 'var(--neo-yellow)', color: '#000' }}
            >
              MISSION CONTROL ACTIVE
            </span>
          </div>

          {/* Main Fridge Status HUD */}
          <FridgeStatusHUD stats={stats} />

          {/* Neobrutalist Navigation Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '6px',
                padding: '6px',
                background: '#07090e',
                border: '2.5px solid #000',
                borderRadius: '12px',
                boxShadow: '4px 4px 0px #000',
                flexWrap: 'wrap',
              }}
            >
              <button
                className="neo-btn"
                style={{
                  background: activeTab === 'dashboard' ? 'var(--neo-yellow)' : '#111827',
                  color: activeTab === 'dashboard' ? '#000' : '#94a3b8',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                }}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>Mission Control</span>
              </button>

              <button
                className="neo-btn"
                style={{
                  background: activeTab === 'pipeline' ? 'var(--neo-cyan)' : '#111827',
                  color: activeTab === 'pipeline' ? '#000' : '#94a3b8',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                }}
                onClick={() => setActiveTab('pipeline')}
              >
                <Cpu size={16} />
                <span>Strands AI Pipeline</span>
              </button>

              <button
                className="neo-btn"
                style={{
                  background: activeTab === 'radar' ? 'var(--neo-green)' : '#111827',
                  color: activeTab === 'radar' ? '#000' : '#94a3b8',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                }}
                onClick={() => setActiveTab('radar')}
              >
                <Radar size={16} />
                <span>Donor Radar</span>
              </button>

              <button
                className="neo-btn"
                style={{
                  background: activeTab === 'shelflife' ? 'var(--neo-purple)' : '#111827',
                  color: activeTab === 'shelflife' ? '#fff' : '#94a3b8',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                }}
                onClick={() => setActiveTab('shelflife')}
              >
                <Database size={16} />
                <span>Shelf-Life Rules</span>
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
              <Sparkles size={13} color="var(--neo-green)" />
              <span>CONNECTED TO AGENTCORE ENGINE</span>
            </div>
          </div>

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              {/* Left Column: Simulator & Live Check-in */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <SmsSimulator onCheckinComplete={handleCheckinComplete} />
                <ActivityLog history={history} onHistoryCleared={() => setHistory([])} />
              </div>

              {/* Right Column: AI Graph & Donor Radar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AgentGraphVisualizer lastExecution={lastExecution} />
                <DonorRadarMap
                  donors={donors}
                  notifiedDonorName={lastExecution?.notified_donor}
                  onDonorAdded={() => fetchDonors().then(setDonors)}
                />
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AgentGraphVisualizer lastExecution={lastExecution} />
              <SmsSimulator onCheckinComplete={handleCheckinComplete} />
            </div>
          )}

          {activeTab === 'radar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <DonorRadarMap
                donors={donors}
                notifiedDonorName={lastExecution?.notified_donor}
                onDonorAdded={() => fetchDonors().then(setDonors)}
              />
            </div>
          )}

          {activeTab === 'shelflife' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ShelfLifeExplorer shelfLife={shelfLife} />
            </div>
          )}

          {/* Footer in console mode as well */}
          <LandingFooter health={health} onNavigateTab={handleNavigateToTab} />
        </div>
      )}
    </div>
  );
};

export default App;
