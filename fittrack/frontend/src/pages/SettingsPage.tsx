import { useState, useEffect } from 'react';
import { Save, User, Weight, Ruler, Heart, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import type { PageName } from '../App';

interface Profile {
  name: string; email: string; location: string; age: number;
  bio: string; weightKg: number; heightCm: number; restingHR: number;
  units: string;
}

interface Props {
  userName: string; onLogout: () => void;
  activePage: PageName; setActivePage: (p: PageName) => void;
}

export default function SettingsPage({ userName, onLogout, activePage, setActivePage }: Props) {
  const [profile, setProfile] = useState<Profile>({
    name: '', email: '', location: '', age: 0, bio: '',
    weightKg: 0, heightCm: 0, restingHR: 0, units: 'metric',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d); }).catch(() => {});
  }, []);

  const handleSave = () => {
    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setProfile(d); setSaved(true); setTimeout(() => setSaved(false), 2000); } });
  };

  const update = (field: keyof Profile, value: string | number) => setProfile({ ...profile, [field]: value });

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-layout">
      <Sidebar userName={userName} onLogout={onLogout} activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1>Settings</h1>
            <p className="page-subtitle">Manage your profile, preferences, and notifications</p>
          </div>
          <button className="primary-btn" onClick={handleSave}>
            <Save size={16} /> {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>

        {/* Profile Card */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <User size={20} className="stat-icon" />
            <div>
              <h3>Profile</h3>
              <p className="page-subtitle" style={{ marginBottom: 0 }}>Your personal information and fitness metrics</p>
            </div>
          </div>

          <div className="profile-avatar-row">
            <div className="settings-avatar">{initials || 'AR'}</div>
            <div>
              <div className="settings-avatar-name">{profile.name || 'Alex Runner'}</div>
              <button className="link-btn">📸 Change avatar</button>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label className="settings-label">FULL NAME</label>
              <input className="settings-input" value={profile.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="settings-field">
              <label className="settings-label">✉ EMAIL</label>
              <input className="settings-input" value={profile.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="settings-field">
              <label className="settings-label">◉ LOCATION</label>
              <input className="settings-input" value={profile.location} onChange={e => update('location', e.target.value)} />
            </div>
            <div className="settings-field">
              <label className="settings-label">AGE</label>
              <input className="settings-input" type="number" value={profile.age} onChange={e => update('age', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="settings-field full-width">
            <label className="settings-label">BIO</label>
            <textarea className="settings-textarea" rows={3} value={profile.bio} onChange={e => update('bio', e.target.value)} />
          </div>
        </div>

        {/* Fitness Metrics */}
        <div className="settings-label section-label">FITNESS METRICS</div>
        <div className="stat-cards-row four-cols">
          <div className="card stat-card editable">
            <div className="stat-card-header"><Weight size={18} className="stat-icon" /><span>WEIGHT</span></div>
            <div className="stat-card-value-editable">
              <input type="number" className="metric-input" value={profile.weightKg} onChange={e => update('weightKg', parseFloat(e.target.value) || 0)} />
              <span className="stat-unit">kg</span>
            </div>
          </div>
          <div className="card stat-card editable">
            <div className="stat-card-header"><Ruler size={18} className="stat-icon" /><span>HEIGHT</span></div>
            <div className="stat-card-value-editable">
              <input type="number" className="metric-input" value={profile.heightCm} onChange={e => update('heightCm', parseInt(e.target.value) || 0)} />
              <span className="stat-unit">cm</span>
            </div>
          </div>
          <div className="card stat-card editable">
            <div className="stat-card-header"><Heart size={18} className="stat-icon" /><span>RESTING HR</span></div>
            <div className="stat-card-value-editable">
              <input type="number" className="metric-input" value={profile.restingHR} onChange={e => update('restingHR', parseInt(e.target.value) || 0)} />
              <span className="stat-unit">bpm</span>
            </div>
          </div>
          <div className="card stat-card editable">
            <div className="stat-card-header"><Calendar size={18} className="stat-icon" /><span>AGE</span></div>
            <div className="stat-card-value-editable">
              <input type="number" className="metric-input" value={profile.age} onChange={e => update('age', parseInt(e.target.value) || 0)} />
              <span className="stat-unit">years</span>
            </div>
          </div>
        </div>

        {/* Units */}
        <div className="card settings-section">
          <div className="settings-section-header">
            <Ruler size={20} className="stat-icon" />
            <div>
              <h3>Units & Measurement</h3>
              <p className="page-subtitle" style={{ marginBottom: 0 }}>Choose your preferred measurement system</p>
            </div>
          </div>
          <div className="units-row">
            <button className={`unit-btn ${profile.units === 'metric' ? 'active' : ''}`} onClick={() => update('units', 'metric')}>Metric (km, kg)</button>
            <button className={`unit-btn ${profile.units === 'imperial' ? 'active' : ''}`} onClick={() => update('units', 'imperial')}>Imperial (mi, lb)</button>
          </div>
        </div>
      </main>
    </div>
  );
}
