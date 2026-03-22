import { useState } from 'react';
import { MapPin } from 'lucide-react';
import RouteCanvas from './RouteCanvas';
import RoutePlanner from './RoutePlanner';
import type { MetricsSummary, RouteUpdate } from '../hooks/useWebSocket';

interface LocationPoint {
  lat: number;
  lng: number;
  address: string;
}

interface RouteInfo {
  start: LocationPoint;
  end: LocationPoint;
  distanceKm: number;
}

interface LiveActivityCardProps {
  metrics: MetricsSummary | null;
  route: RouteUpdate | null;
}

function formatPace(paceMinPerKm: number): string {
  if (!paceMinPerKm || paceMinPerKm <= 0) return "--'--\"";
  const mins = Math.floor(paceMinPerKm);
  const secs = Math.round((paceMinPerKm - mins) * 60);
  return `${mins}'${secs.toString().padStart(2, '0')}"`;
}

export default function LiveActivityCard({ metrics, route }: LiveActivityCardProps) {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // If we have a planned route, show its start/end as route points
  const routePoints = routeInfo
    ? [[routeInfo.start.lat, routeInfo.start.lng], [routeInfo.end.lat, routeInfo.end.lng]]
    : (route?.points || []);
  const destCoords = routeInfo ? [routeInfo.end.lat, routeInfo.end.lng] : null;

  return (
    <div className="card hero-card">
      {/* Live Badge */}
      <div className="live-badge">
        <span className="live-badge-dot" />
        LIVE ACTIVITY
      </div>

      {/* Title */}
      <h2 className="hero-title">
        {routeInfo
          ? 'PLANNED ROUTE'
          : metrics ? 'MORNING RUN' : 'WAITING FOR SESSION...'}
      </h2>
      <p className="hero-subtitle">
        {routeInfo
          ? `${routeInfo.start.address.split(',')[0]} → ${routeInfo.end.address.split(',')[0]}`
          : metrics
          ? 'Tracking active route'
          : 'Start a session to begin tracking'}
      </p>

      {/* Route Planner */}
      <RoutePlanner
        routeInfo={routeInfo}
        onRouteSet={(start, end, distanceKm) => setRouteInfo({ start, end, distanceKm })}
        onRouteClear={() => setRouteInfo(null)}
      />

      {/* Route Canvas */}
      <RouteCanvas points={routePoints} destination={destCoords} />

      {/* Stats Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-label">PACE</span>
            <span className="hero-stat-value">
              {metrics ? `${formatPace(metrics.paceMinPerKm)}/km` : "--'--\"/km"}
            </span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">ELEVATION</span>
            <span className="hero-stat-value">
              {metrics ? `${Math.round(metrics.elevationMeters)}m` : '--m'}
            </span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">
              {routeInfo ? 'ROUTE DISTANCE' : 'AVG HEART RATE'}
            </span>
            <span className="hero-stat-value" style={routeInfo ? { color: '#f5a623', fontWeight: 800 } : undefined}>
              {routeInfo
                ? `${routeInfo.distanceKm.toFixed(2)} km`
                : metrics ? `${metrics.heartRateBpm} bpm` : '-- bpm'}
            </span>
          </div>
        </div>
        <button className="view-map-btn">
          <MapPin size={16} />
          View Detailed Map
        </button>
      </div>
    </div>
  );
}
