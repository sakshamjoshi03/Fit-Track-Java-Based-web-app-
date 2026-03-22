import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Flame, Timer, Footprints, Calendar, Activity } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import type { PageName } from '../App';

interface ChartPoint { day: string; value: number; }

interface ProgressData {
  period: string; totalDistanceKm: number; totalCaloriesKcal: number;
  avgPaceMinPerKm: number; totalDurationSeconds: number; totalSteps: number;
  activeDays: number; totalDays: number;
  distanceChangePercent: number; caloriesChangePercent: number; paceChangePercent: number;
  distanceChart: ChartPoint[]; caloriesChart: ChartPoint[];
  paceChart: ChartPoint[]; stepsChart: ChartPoint[];
}

interface Props {
  userName: string; onLogout: () => void;
  activePage: PageName; setActivePage: (p: PageName) => void;
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

// SVG Line Chart Component
function LineChart({ data, color, height = 200, showArea = false }: { data: ChartPoint[]; color: string; height?: number; showArea?: boolean }) {
  const w = 520, pad = 40, chartW = w - 2 * pad, chartH = height - 2 * pad;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => ({
    x: pad + (i / Math.max(data.length - 1, 1)) * chartW,
    y: pad + chartH - (d.value / maxVal) * chartH,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${points[points.length - 1]?.x ?? pad} ${pad + chartH} L ${pad} ${pad + chartH} Z`;

  // Y-axis labels
  const yLabels = [0, maxVal / 2, maxVal].map(v => ({ v, y: pad + chartH - (v / maxVal) * chartH }));

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height: '100%' }}>
      {/* Grid */}
      {yLabels.map((l, i) => (
        <g key={i}>
          <line x1={pad} y1={l.y} x2={w - pad} y2={l.y} stroke="#2a2a2a" strokeDasharray="4,4" />
          <text x={pad - 8} y={l.y + 4} fill="#6b7280" fontSize="10" textAnchor="end" fontFamily="Inter">
            {l.v >= 1000 ? `${(l.v/1000).toFixed(0)}k` : l.v % 1 === 0 ? l.v.toFixed(0) : l.v.toFixed(1)}
          </text>
        </g>
      ))}
      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={pad + (i / Math.max(data.length - 1, 1)) * chartW} y={height - 8}
          fill="#6b7280" fontSize="11" textAnchor="middle" fontFamily="Inter">{d.day}</text>
      ))}
      {showArea && <path d={areaD} fill={`${color}15`} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />)}
    </svg>
  );
}

// SVG Bar Chart
function BarChart({ data, color, height = 200 }: { data: ChartPoint[]; color: string; height?: number }) {
  const w = 420, pad = 40, chartW = w - 2 * pad, chartH = height - 2 * pad;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length;

  const yLabels = [0, maxVal / 2, maxVal].map(v => ({ v, y: pad + chartH - (v / maxVal) * chartH }));

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height: '100%' }}>
      {yLabels.map((l, i) => (
        <g key={i}>
          <line x1={pad} y1={l.y} x2={w - pad} y2={l.y} stroke="#2a2a2a" strokeDasharray="4,4" />
          <text x={pad - 8} y={l.y + 4} fill="#6b7280" fontSize="10" textAnchor="end" fontFamily="Inter">{Math.round(l.v)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = pad + i * gap + (gap - barW) / 2;
        const y = pad + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={color} rx="4" opacity="0.85" />
            <text x={x + barW / 2} y={height - 8} fill="#6b7280" fontSize="11" textAnchor="middle" fontFamily="Inter">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ProgressPage({ userName, onLogout, activePage, setActivePage }: Props) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch(`/api/progress?period=${period}`)
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {});
  }, [period]);

  return (
    <div className="app-layout">
      <Sidebar userName={userName} onLogout={onLogout} activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1>Performance Trends</h1>
            <p className="page-subtitle">Time-series analytics across all tracked metrics · Personal data only</p>
          </div>
          <div className="toggle-group">
            <button className={`toggle-btn ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>Weekly</button>
            <button className={`toggle-btn ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>Monthly</button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="stat-cards-row six-cols">
          <div className="card stat-card">
            <div className="stat-card-header"><TrendingUp size={18} className="stat-icon" /><span>TOTAL DISTANCE</span></div>
            <div className="stat-card-value">{data?.totalDistanceKm ?? '--'}<span className="stat-unit">km</span></div>
            {data && <div className="stat-change positive">↗ +{data.distanceChangePercent}%</div>}
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Flame size={18} className="stat-icon" /><span>CALORIES BURNED</span></div>
            <div className="stat-card-value">{data ? Math.round(data.totalCaloriesKcal).toLocaleString() : '--'}<span className="stat-unit">kcal</span></div>
            {data && <div className="stat-change positive">↗ +{data.caloriesChangePercent}%</div>}
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Timer size={18} className="stat-icon" /><span>AVG PACE</span></div>
            <div className="stat-card-value">{data ? data.avgPaceMinPerKm.toFixed(2) : '--'}<span className="stat-unit">min/km</span></div>
            {data && <div className="stat-change positive">↗ +{data.paceChangePercent}%</div>}
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Calendar size={18} className="stat-icon" /><span>TOTAL DURATION</span></div>
            <div className="stat-card-value">{data ? formatDuration(data.totalDurationSeconds) : '--'}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Footprints size={18} className="stat-icon" /><span>TOTAL STEPS</span></div>
            <div className="stat-card-value">{data ? data.totalSteps.toLocaleString() : '--'}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Activity size={18} className="stat-icon" /><span>ACTIVE DAYS</span></div>
            <div className="stat-card-value">{data ? `${data.activeDays}` : '--'}<span className="stat-unit">of {data?.totalDays ?? 7}</span></div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="card chart-card">
            <h3>Distance Trend</h3>
            <div className="chart-container">
              {data?.distanceChart ? <LineChart data={data.distanceChart} color="#f5a623" showArea /> : <div className="chart-placeholder">Loading...</div>}
            </div>
          </div>
          <div className="card chart-card">
            <h3>Calories Burned</h3>
            <div className="chart-container">
              {data?.caloriesChart ? <BarChart data={data.caloriesChart} color="#f5a623" /> : <div className="chart-placeholder">Loading...</div>}
            </div>
          </div>
          <div className="card chart-card">
            <h3>Pace Trend</h3>
            <div className="chart-container">
              {data?.paceChart ? <LineChart data={data.paceChart} color="#3b82f6" /> : <div className="chart-placeholder">Loading...</div>}
            </div>
          </div>
          <div className="card chart-card">
            <h3>Steps Overview</h3>
            <div className="chart-container">
              {data?.stepsChart ? <LineChart data={data.stepsChart} color="#22c55e" showArea /> : <div className="chart-placeholder">Loading...</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
