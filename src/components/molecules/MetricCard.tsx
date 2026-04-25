interface MetricCardProps {
  label: string;
  value: number;
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="metric">
      <span>{value}</span>
      <small>{label}</small>
    </div>
  );
}
