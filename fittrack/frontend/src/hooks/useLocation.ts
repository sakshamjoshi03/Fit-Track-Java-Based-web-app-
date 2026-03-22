import { useState, useEffect } from 'react';

export interface SessionInfo {
  active: boolean;
  id?: string;
  activityType?: string;
  locationName?: string;
  routePointCount?: number;
}

export function useLocation() {
  const [session, setSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    fetch('/api/location/session/active')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setSession(data);
      })
      .catch(() => {
        // Backend not available
      });
  }, []);

  return session;
}
