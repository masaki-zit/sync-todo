/** 件数サマリー 1 枚分の表示を担当するファイル。 */
/** `MetricCard` に渡すラベルと数値。 */
interface MetricCardProps {
  label: string;
  value: number;
}

/**
 * 単一の集計値カードを表示する。
 * @param props 表示ラベルと数値
 * @returns 集計値カード
 */
export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="metric">
      <span>{value}</span>
      <small>{label}</small>
    </div>
  );
}
