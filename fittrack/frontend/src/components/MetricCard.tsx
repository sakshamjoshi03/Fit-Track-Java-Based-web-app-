import type { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  detail?: string;
  detailType?: 'positive' | 'goal-met' | 'neutral';
  progress?: { current: number; target: number }; // for steps progress bar
  loading?: boolean;
}

export default function MetricCard({
  icon,
  label,
  value,
  unit,
  detail,
  detailType = 'neutral',
  progress,
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="card metric-card">
        <div className="metric-card-header">
          <span className="metric-icon">{icon}</span>
          <span className="metric-label">{label}</span>
        </div>
        <div className="skeleton skeleton-value" />
        <div className="skeleton skeleton-text" style={{ marginTop: 8 }} />
      </div>
    );
  }

  return (
    <div className="card metric-card">
      <div className="metric-card-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">
        {value}
        <span className="metric-unit">{unit}</span>
      </div>
      {detail && (
        <div className={`metric-detail ${detailType}`}>
          {detailType === 'positive' && '↗ '}
          {detailType === 'goal-met' && '● '}
          {detail}
        </div>
      )}
      {progress && (
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min((progress.current / progress.target) * 100, 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
