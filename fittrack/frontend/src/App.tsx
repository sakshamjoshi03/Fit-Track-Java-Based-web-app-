import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import ActivitiesPage from './pages/ActivitiesPage';
import ProgressPage from './pages/ProgressPage';
import GoalsPage from './pages/GoalsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

interface User {
  name: string;
  email: string;
}

export type PageName = 'Dashboard' | 'Activities' | 'Progress' | 'Goals' | 'Settings';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<PageName>('Dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('fittrack_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('fittrack_user');
      }
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
  };

  const handleLogout = () => {
    localStorage.removeItem('fittrack_user');
    setUser(null);
    setActivePage('Dashboard');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageProps = { userName: user.name, onLogout: handleLogout, activePage, setActivePage };

  switch (activePage) {
    case 'Activities':
      return <ActivitiesPage {...pageProps} />;
    case 'Progress':
      return <ProgressPage {...pageProps} />;
    case 'Goals':
      return <GoalsPage {...pageProps} />;
    case 'Settings':
      return <SettingsPage {...pageProps} />;
    default:
      return <Dashboard {...pageProps} />;
  }
}

export default App;
