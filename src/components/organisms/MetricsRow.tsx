/** タスク件数サマリーを横並びで表示するファイル。 */
import { MetricCard } from "../molecules/MetricCard";

/** `MetricsRow` に渡す集計済み件数。 */
interface MetricsRowProps {
  completedCount: number;
  pendingCount: number;
  taskCount: number;
}

/**
 * タスク総数・完了数・保留数を表示する。
 * @param props 表示済みの集計値
 * @returns メトリクス行
 */
export function MetricsRow({ completedCount, pendingCount, taskCount }: MetricsRowProps) {
  return (
    <div className="metrics-row">
      <MetricCard label="tasks" value={taskCount} />
      <MetricCard label="done" value={completedCount} />
      <MetricCard label="pending" value={pendingCount} />
    </div>
  );
}
