import type { ReactNode } from "react";

interface SyncBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "pending" | "conflict";
}

export function SyncBadge({ children, icon, tone = "default" }: SyncBadgeProps) {
  const toneClass = tone === "default" ? "" : `is-${tone}`;

  return (
    <span className={`sync-badge ${toneClass}`.trim()}>
      {icon}
      {children}
    </span>
  );
}
