import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, TrendingUp, Flame, Trophy } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import type { PageName } from '../App';

interface Activity {
  id: string; name: string; type: string; distanceKm: number;
  durationSeconds: number; heartRateBpm: number; elevationMeters: number;
  caloriesKcal: number; paceMinPerKm: number; dateFormatted: string;
  personalRecord: boolean; timeAgo: string;
}

interface Stats {
  totalActivities: number; totalDistanceKm: number;
  totalCaloriesKcal: number; personalRecords: number;
}

interface Props {
  userName: string; onLogout: () => void;
  activePage: PageName; setActivePage: (p: PageName) => void;
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function formatPace(p: number): string {
  if (!p || p <= 0) return '--';
  const min = Math.floor(p);
  const sec = Math.round((p - min) * 60);
  return `${min}'${sec.toString().padStart(2,'0')}"`;
}

const TYPE_COLORS: Record<string, string> = {
  Running: '#f5a623', Walking: '#22c55e', Cycling: '#3b82f6', Trekking: '#a855f7',
};

export default function ActivitiesPage({ userName, onLogout, activePage, setActivePage }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = typeFilter ? `/api/activities?type=${typeFilter}` : '/api/activities';
    fetch(url).then(r => r.ok ? r.json() : []).then(setActivities).catch(() => {});
    fetch('/api/activities/stats').then(r => r.ok ? r.json() : null).then(setStats).catch(() => {});
  }, [typeFilter]);

  const filtered = activities.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-layout">
      <Sidebar userName={userName} onLogout={onLogout} activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1>Activity History</h1>
            <p className="page-subtitle">Calendar-indexed log of all recorded activities · Personal analytics only</p>
          </div>
          <div className="top-bar-actions">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input type="text" className="search-input" placeholder="Search analytics..." />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stat-cards-row">
          <div className="card stat-card">
            <div className="stat-card-header"><Calendar size={18} className="stat-icon" /><span>TOTAL ACTIVITIES</span></div>
            <div className="stat-card-value">{stats?.totalActivities ?? '--'}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><TrendingUp size={18} className="stat-icon" /><span>TOTAL DISTANCE</span></div>
            <div className="stat-card-value">{stats ? `${stats.totalDistanceKm.toFixed(1)}` : '--'}<span className="stat-unit">km</span></div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Flame size={18} className="stat-icon" /><span>CALORIES BURNED</span></div>
            <div className="stat-card-value">{stats ? Math.round(stats.totalCaloriesKcal).toLocaleString() : '--'}<span className="stat-unit">kcal</span></div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Trophy size={18} className="stat-icon" /><span>PERSONAL RECORDS</span></div>
            <div className="stat-card-value">{stats?.personalRecords ?? '--'}<span className="stat-unit">PRs</span></div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="table-controls">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input type="text" className="search-input" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select className="type-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Running">Running</option>
              <option value="Walking">Walking</option>
              <option value="Cycling">Cycling</option>
              <option value="Trekking">Trekking</option>
            </select>
          </div>
          <span className="table-count">{filtered.length} of {activities.length} activities</span>
        </div>

        {/* Data Table */}
        <div className="card data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date ↕</th><th>Activity</th><th>Type</th><th>Distance ↕</th>
                <th>Duration</th><th>Pace</th><th>Calories ↕</th><th>Elevation</th><th>Avg HR</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="td-date">{a.dateFormatted}</td>
                  <td className="td-name">
                    {a.name}
                    {a.personalRecord && <span className="pr-badge">PR</span>}
                  </td>
                  <td>
                    <span className="type-badge" style={{ background: `${TYPE_COLORS[a.type] || '#666'}22`, color: TYPE_COLORS[a.type] || '#666', border: `1px solid ${TYPE_COLORS[a.type] || '#666'}44` }}>
                      {a.type}
                    </span>
                  </td>
                  <td><strong>{a.distanceKm.toFixed(2)}</strong> <span className="td-unit">km</span></td>
                  <td>⏱ {formatDuration(a.durationSeconds)}</td>
                  <td>{a.type === 'Cycling' ? `${(a.distanceKm / (a.durationSeconds / 3600)).toFixed(1)} km/h` : `${formatPace(a.paceMinPerKm)}/km`}</td>
                  <td>{Math.round(a.caloriesKcal)} <span className="td-unit">kcal</span></td>
                  <td>{Math.round(a.elevationMeters)}<span className="td-unit">m</span></td>
                  <td>{a.heartRateBpm} <span className="td-unit">bpm</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="td-empty">No activities found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
