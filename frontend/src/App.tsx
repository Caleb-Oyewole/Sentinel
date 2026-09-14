import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
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
import { LayoutDashboard, Cpu, Radar, Database, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'radar' | 'shelflife'>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [shelfLife, setShelfLife] = useState<ShelfLifeData | null>(null);
  const [history, setHistory] = useState<CheckinExecutionResult[]>([]);
  const [lastExecution, setLastExecution] = useState<CheckinExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadAllData = async () => {
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
        if (histRes.value.length > 0 && !lastExecution) {
          setLastExecution(histRes.value[0]);
        }
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => {
      fetchStats().then(setStats).catch(() => {});
      fetchHistory().then(setHistory).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckinComplete = (result: CheckinExecutionResult) => {
    setLastExecution(result);
    fetchStats().then(setStats).catch(() => {});
    fetchHistory().then((h) => setHistory(h)).catch(() => {});
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        health={health}
        loading={loading}
        onRefresh={loadAllData}
        lastUpdated={lastUpdated}
      />

      {/* Main Fridge Status HUD */}
      <FridgeStatusHUD stats={stats} />

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} />
            <span>Mission Control</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            <Cpu size={16} />
            <span>Strands AI Pipeline</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            <Radar size={16} />
            <span>Donor Radar</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'shelflife' ? 'active' : ''}`}
            onClick={() => setActiveTab('shelflife')}
          >
            <Database size={16} />
            <span>Shelf-Life Rules</span>
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
          <Sparkles size={12} color="#10b981" />
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
    </div>
  );
};
export default App;
