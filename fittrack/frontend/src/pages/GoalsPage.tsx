import { useState, useEffect } from 'react';
import { Plus, Target, Trophy, TrendingUp, Trash2, Flame, Footprints } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import type { PageName } from '../App';

interface Goal {
  id: string; name: string; type: string; category: string;
  currentValue: number; targetValue: number; percentage: number;
  unit: string; status: string; createdDate: string; dueDate: string;
  daysRemaining: number;
}

interface GoalStats { activeGoals: number; completedGoals: number; avgProgress: number; }

interface Props {
  userName: string; onLogout: () => void;
  activePage: PageName; setActivePage: (p: PageName) => void;
}

const CATEGORY_ICONS: Record<string, typeof TrendingUp> = {
  Distance: TrendingUp, Calories: Flame, Steps: Footprints,
};
const CATEGORY_COLORS: Record<string, string> = {
  Distance: '#f5a623', Calories: '#ef4444', Steps: '#22c55e',
};

export default function GoalsPage({ userName, onLogout, activePage, setActivePage }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', category: 'Distance', targetValue: '', unit: 'km' });

  const loadData = () => {
    fetch('/api/goals').then(r => r.ok ? r.json() : []).then(setGoals).catch(() => {});
    fetch('/api/goals/stats').then(r => r.ok ? r.json() : null).then(setStats).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const filtered = goals.filter(g => {
    if (filter === 'active') return g.status === 'active';
    if (filter === 'completed') return g.status === 'completed';
    return true;
  });

  const handleDelete = (id: string) => {
    fetch(`/api/goals/${id}`, { method: 'DELETE' }).then(() => loadData());
  };

  const handleCreate = () => {
    if (!newGoal.name || !newGoal.targetValue) return;
    fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newGoal.name, category: newGoal.category,
        type: newGoal.category === 'Steps' ? 'DAILY_STEPS' : newGoal.category === 'Calories' ? 'WEEKLY_CALORIES' : 'WEEKLY_DISTANCE',
        targetValue: parseFloat(newGoal.targetValue), unit: newGoal.unit,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dueDate: 'Apr 30', status: 'active',
      }),
    }).then(() => { loadData(); setShowModal(false); setNewGoal({ name: '', category: 'Distance', targetValue: '', unit: 'km' }); });
  };

  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="app-layout">
      <Sidebar userName={userName} onLogout={onLogout} activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1>Fitness Goals</h1>
            <p className="page-subtitle">Set targets, track progress, achieve personal records</p>
          </div>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Goal
          </button>
        </div>

        {/* Stats */}
        <div className="stat-cards-row three-cols">
          <div className="card stat-card">
            <div className="stat-card-header"><Target size={18} className="stat-icon" /><span>ACTIVE GOALS</span></div>
            <div className="stat-card-value">{stats?.activeGoals ?? activeCount}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><Trophy size={18} className="stat-icon" /><span>COMPLETED</span></div>
            <div className="stat-card-value">{stats?.completedGoals ?? completedCount}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-header"><TrendingUp size={18} className="stat-icon" /><span>AVG PROGRESS</span></div>
            <div className="stat-card-value">{stats?.avgProgress ?? '--'}%</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && ` (${goals.length})`}
              {f === 'active' && ` (${activeCount})`}
              {f === 'completed' && ` (${completedCount})`}
            </button>
          ))}
        </div>

        {/* Goal Cards */}
        <div className="goals-list">
          {filtered.map(g => {
            const Icon = CATEGORY_ICONS[g.category] || TrendingUp;
            const color = CATEGORY_COLORS[g.category] || '#f5a623';
            return (
              <div className="card goal-card" key={g.id}>
                <div className="goal-card-top">
                  <div className="goal-card-left">
                    <div className="goal-card-icon" style={{ background: `${color}15`, color }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="goal-card-name">{g.name}</div>
                      <div className="goal-card-meta">
                        <span className="category-tag" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>{g.category}</span>
                        <span className="goal-card-date">Created {g.createdDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="goal-card-right">
                    {g.status === 'completed' ? (
                      <span className="completed-badge">Completed</span>
                    ) : (
                      <span className="goal-card-due">⏳ {g.daysRemaining > 0 ? `${g.daysRemaining}d left` : 'Due today'}</span>
                    )}
                    <button className="delete-btn" onClick={() => handleDelete(g.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="goal-card-progress">
                  <span className="goal-card-values">
                    <strong>{g.currentValue >= 1000 ? g.currentValue.toLocaleString() : g.currentValue.toFixed(1)}</strong>
                    {' '}/ {g.targetValue >= 1000 ? g.targetValue.toLocaleString() : g.targetValue} {g.unit}
                  </span>
                  <span className="goal-card-percent" style={{ color: g.percentage >= 100 ? '#22c55e' : color }}>
                    {Math.min(Math.round(g.percentage), 100)}%
                  </span>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: `${Math.min(g.percentage, 100)}%`, background: g.percentage >= 100 ? '#22c55e' : color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Goal Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>Create New Goal</h2>
              <div className="modal-form">
                <label className="login-label">Goal Name</label>
                <input className="login-input" placeholder="e.g. April Running Challenge" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
                <label className="login-label">Category</label>
                <select className="login-input" value={newGoal.category} onChange={e => setNewGoal({...newGoal, category: e.target.value, unit: e.target.value === 'Steps' ? 'steps' : e.target.value === 'Calories' ? 'kcal' : 'km'})}>
                  <option>Distance</option><option>Calories</option><option>Steps</option>
                </select>
                <label className="login-label">Target Value ({newGoal.unit})</label>
                <input className="login-input" type="number" placeholder="e.g. 100" value={newGoal.targetValue} onChange={e => setNewGoal({...newGoal, targetValue: e.target.value})} />
                <div className="modal-actions">
                  <button className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="primary-btn" onClick={handleCreate}>Create Goal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
