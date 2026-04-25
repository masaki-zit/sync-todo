import { MetricCard } from "../molecules/MetricCard";

interface MetricsRowProps {
  completedCount: number;
  pendingCount: number;
  taskCount: number;
}

export function MetricsRow({ completedCount, pendingCount, taskCount }: MetricsRowProps) {
  return (
    <div className="metrics-row">
      <MetricCard label="tasks" value={taskCount} />
      <MetricCard label="done" value={completedCount} />
      <MetricCard label="pending" value={pendingCount} />
    </div>
  );
}
