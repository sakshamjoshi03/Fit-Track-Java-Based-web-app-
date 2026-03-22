import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Target,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react';
import type { PageName } from '../App';

const navItems: { icon: typeof LayoutDashboard; label: PageName }[] = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Activity, label: 'Activities' },
  { icon: TrendingUp, label: 'Progress' },
  { icon: Target, label: 'Goals' },
  { icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  userName?: string;
  onLogout?: () => void;
  activePage?: PageName;
  setActivePage?: (page: PageName) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({
  userName = 'Alex Rivera',
  onLogout,
  activePage = 'Dashboard',
  setActivePage,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={20} />
        </div>
        <span className="sidebar-title">FitTrack</span>
      </div>
      <div className="sidebar-subtitle">ELITE PERFORMANCE</div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`sidebar-nav-item ${activePage === item.label ? 'active' : ''}`}
            onClick={() => setActivePage?.(item.label)}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{getInitials(userName)}</div>
        <div style={{ flex: 1 }}>
          <div className="sidebar-user-name">{userName}</div>
          <div className="sidebar-user-role">Pro Athlete</div>
        </div>
        {onLogout && (
          <span
            onClick={onLogout}
            title="Sign out"
            style={{ color: '#6b7280', cursor: 'pointer', flexShrink: 0, display: 'flex' }}
          >
            <LogOut size={16} />
          </span>
        )}
      </div>
    </aside>
  );
}
