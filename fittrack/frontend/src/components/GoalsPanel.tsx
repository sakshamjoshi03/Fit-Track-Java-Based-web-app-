import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  unit: string;
}

interface GoalsPanelProps {
  stepsData?: { current: number; target: number };
  distanceData?: { current: number; target: number };
}

export default function GoalsPanel({ stepsData, distanceData }: GoalsPanelProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetch('/api/goals')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setGoals(data))
      .catch(() => {});
  }, []);

  // Override with live WebSocket data
  const renderedGoals =
    goals.length > 0
      ? goals.map((g) => {
          if (g.type === 'DAILY_STEPS' && stepsData) {
            return { ...g, currentValue: stepsData.current, percentage: (stepsData.current / stepsData.target) * 100 };
          }
          if (g.type === 'WEEKLY_DISTANCE' && distanceData) {
            return { ...g, currentValue: distanceData.current, percentage: (distanceData.current / distanceData.target) * 100 };
          }
          return g;
        })
      : [
          // Default display when API hasn't loaded
          {
            id: '1',
            name: 'Daily Steps Target',
            type: 'DAILY_STEPS',
            currentValue: stepsData?.current || 0,
            targetValue: stepsData?.target || 15000,
            percentage: stepsData ? (stepsData.current / stepsData.target) * 100 : 0,
            unit: 'steps',
          },
          {
            id: '2',
            name: 'Weekly Running Distance',
            type: 'WEEKLY_DISTANCE',
            currentValue: distanceData?.current || 0,
            targetValue: distanceData?.target || 40,
            percentage: distanceData ? (distanceData.current / distanceData.target) * 100 : 0,
            unit: 'km',
          },
        ];

  const formatValue = (g: Goal) => {
    if (g.type === 'DAILY_STEPS') {
      return `${g.currentValue.toLocaleString()} / ${g.targetValue.toLocaleString()}`;
    }
    return `${g.currentValue.toFixed(1)} / ${g.targetValue} ${g.unit}`;
  };

  return (
    <div className="card goals-panel">
      <div className="goals-header">
        <h3 className="goals-title">Active Goals</h3>
        <button className="create-goal-btn">
          <Plus size={14} />
          Create New
        </button>
      </div>
      {renderedGoals.map((g) => (
        <div key={g.id}>
          <div className="goal-row">
            <span className="goal-name">{g.name}</span>
            <span className="goal-progress-text">{formatValue(g)}</span>
          </div>
          <div className="goal-progress-bar">
            <div
              className="goal-progress-fill"
              style={{ width: `${Math.min(g.percentage, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
