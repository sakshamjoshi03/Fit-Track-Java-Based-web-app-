import { useState, useEffect } from 'react';
import { PersonStanding, Footprints } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  timeAgo: string;
  comparison: string;
}

export default function ActivityHistoryCard() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/api/activities/recent?limit=2')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setActivities(data))
      .catch(() => {});
  }, []);

  if (activities.length === 0) {
    return (
      <>
        <div className="card recent-card">
          <div className="recent-card-header">
            <div className="recent-card-icon">
              <PersonStanding size={22} />
            </div>
            <span className="recent-card-time">--</span>
          </div>
          <div className="recent-card-name">No recent activity</div>
          <div className="recent-card-bottom">
            <span className="recent-card-distance">
              --<span className="recent-card-unit">km</span>
            </span>
            <span className="recent-card-comparison neutral">Waiting for data</span>
          </div>
        </div>
        <div className="card recent-card">
          <div className="recent-card-header">
            <div className="recent-card-icon">
              <Footprints size={22} />
            </div>
            <span className="recent-card-time">--</span>
          </div>
          <div className="recent-card-name">No recent activity</div>
          <div className="recent-card-bottom">
            <span className="recent-card-distance">
              --<span className="recent-card-unit">km</span>
            </span>
            <span className="recent-card-comparison neutral">Waiting for data</span>
          </div>
        </div>
      </>
    );
  }

  const icons = [PersonStanding, Footprints];

  return (
    <>
      {activities.map((activity, idx) => {
        const Icon = icons[idx % icons.length];
        const isPositive = activity.comparison?.startsWith('+');
        return (
          <div className="card recent-card" key={activity.id || idx}>
            <div className="recent-card-header">
              <div className="recent-card-icon">
                <Icon size={22} />
              </div>
              <span className="recent-card-time">
                {activity.timeAgo?.toUpperCase() || '--'}
              </span>
            </div>
            <div className="recent-card-name">{activity.name}</div>
            <div className="recent-card-bottom">
              <span className="recent-card-distance">
                {activity.distanceKm?.toFixed(2) || '--'}
                <span className="recent-card-unit">km</span>
              </span>
              <span className={`recent-card-comparison ${isPositive ? 'positive' : 'neutral'}`}>
                {activity.comparison || 'Standard'}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
