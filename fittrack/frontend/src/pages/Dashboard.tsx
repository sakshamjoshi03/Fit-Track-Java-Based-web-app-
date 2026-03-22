import { useState, useEffect } from 'react';
import type { PageName } from '../App';
import {
  Search,
  Bell,
  MapPin,
  Footprints,
  Timer,
  Flame,
  AlertTriangle,
  Wifi,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import LiveActivityCard from '../components/LiveActivityCard';
import MetricCard from '../components/MetricCard';
import GoalsPanel from '../components/GoalsPanel';
import ActivityHistoryCard from '../components/ActivityHistoryCard';
import MilestoneCard from '../components/MilestoneCard';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMetrics } from '../hooks/useMetrics';

interface SystemHealth {
  services: {
    googleGeolocation: { configured: boolean };
    googleGeocoding: { configured: boolean };
    healthConnect: { configured: boolean };
  };
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

interface DashboardProps {
  userName: string;
  onLogout: () => void;
  activePage: PageName;
  setActivePage: (page: PageName) => void;
}

export default function Dashboard({ userName, onLogout, activePage, setActivePage }: DashboardProps) {
  const { metrics: wsMetrics, route, connected } = useWebSocket();
  const metrics = useMetrics(wsMetrics);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [hasUnconfiguredKeys, setHasUnconfiguredKeys] = useState(false);

  // Check system health on mount
  useEffect(() => {
    fetch('/api/system/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SystemHealth | null) => {
        if (data) {
          setHealth(data);
          const services = data.services;
          const unconfigured =
            !services.googleGeolocation.configured ||
            !services.googleGeocoding.configured ||
            !services.healthConnect.configured;
          setHasUnconfiguredKeys(unconfigured);
        }
      })
      .catch(() => {
        // Backend not available
      });
  }, []);

  const loading = !metrics;

  return (
    <div className="app-layout">
      <Sidebar userName={userName} onLogout={onLogout} activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h1>Performance Overview</h1>
          <div className="top-bar-actions">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search analytics..."
              />
            </div>
            <button className="notification-btn" id="notification-bell">
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        {hasUnconfiguredKeys && (
          <div className="warning-banner">
            <AlertTriangle size={16} />
            <span>
              Some API keys are not configured. Dashboard data may be limited.
              Check Settings → API Keys.
            </span>
          </div>
        )}

        {/* Reconnecting Badge */}
        {!connected && (
          <div className="reconnecting-badge">
            <Wifi size={16} />
            Reconnecting...
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Hero — Live Activity */}
          <div className="hero-area">
            <LiveActivityCard metrics={metrics} route={route} />
          </div>

          {/* Recent Activities */}
          <div className="recent-area">
            <ActivityHistoryCard />
          </div>

          {/* Metrics Row */}
          <div className="metrics-row">
            <MetricCard
              icon={<MapPin size={18} />}
              label="DISTANCE"
              value={metrics ? metrics.distanceKm.toFixed(1) : '--'}
              unit="km"
              detail="Weekly trend up"
              detailType="positive"
              loading={loading}
            />
            <MetricCard
              icon={<Footprints size={18} />}
              label="STEPS"
              value={metrics ? metrics.steps.toLocaleString() : '--'}
              unit=""
              progress={
                metrics
                  ? { current: metrics.steps, target: metrics.dailyStepsTarget }
                  : undefined
              }
              loading={loading}
            />
            <MetricCard
              icon={<Timer size={18} />}
              label="TIME"
              value={metrics ? formatTime(metrics.activeTimeSeconds) : '--:--'}
              unit="hr"
              detail="Active moving time"
              loading={loading}
            />
            <MetricCard
              icon={<Flame size={18} />}
              label="CALORIES"
              value={metrics ? Math.round(metrics.caloriesKcal).toLocaleString() : '--'}
              unit="kcal"
              detail={metrics?.dailyGoalMet ? 'Daily goal met' : 'In progress'}
              detailType={metrics?.dailyGoalMet ? 'goal-met' : 'neutral'}
              loading={loading}
            />
          </div>

          {/* Bottom Row: Goals + Milestone */}
          <div className="bottom-area">
            <GoalsPanel
              stepsData={
                metrics
                  ? { current: metrics.steps, target: metrics.dailyStepsTarget }
                  : undefined
              }
              distanceData={
                metrics
                  ? { current: metrics.distanceKm, target: metrics.weeklyDistanceTargetKm }
                  : undefined
              }
            />
            <MilestoneCard distanceKm={metrics?.distanceKm || 0} />
          </div>
        </div>
      </main>
    </div>
  );
}
