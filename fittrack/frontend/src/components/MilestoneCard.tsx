import { Trophy } from 'lucide-react';

interface MilestoneCardProps {
  distanceKm: number;
}

// Milestones with cumulative distance targets
const MILESTONES = [
  { name: 'First Steps', distanceKm: 5, badge: '5K Starter' },
  { name: 'Getting Warmed Up', distanceKm: 10, badge: '10K Runner' },
  { name: 'Half Marathon Prep', distanceKm: 21, badge: 'Half Marathon' },
  { name: 'Marathon Prep', distanceKm: 40, badge: 'Marathon Prep' },
  { name: 'Ultra Runner', distanceKm: 80, badge: 'Ultra Runner' },
  { name: 'Century Club', distanceKm: 100, badge: 'Century Club' },
];

export default function MilestoneCard({ distanceKm }: MilestoneCardProps) {
  // Find the next unachieved milestone
  const nextMilestone = MILESTONES.find((m) => distanceKm < m.distanceKm) || MILESTONES[MILESTONES.length - 1];
  const remaining = Math.max(0, nextMilestone.distanceKm - distanceKm);

  return (
    <div className="card milestone-card">
      <div className="milestone-icon">
        <Trophy size={24} />
      </div>
      <div className="milestone-title">NEXT MILESTONE</div>
      <p className="milestone-desc">
        {remaining > 0
          ? `You're only ${remaining.toFixed(1)}km away from achieving the "${nextMilestone.badge}" badge!`
          : `Congratulations! You've achieved the "${nextMilestone.badge}" badge!`}
      </p>
    </div>
  );
}
