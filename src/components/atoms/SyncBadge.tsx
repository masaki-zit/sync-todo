/** 同期状態を示す小さなバッジ表示を共通化するファイル。 */
import type { ReactNode } from "react";

/** `SyncBadge` に渡す表示内容と見た目の種別。 */
interface SyncBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "pending" | "conflict";
}

/**
 * 同期状態に応じた見た目のバッジを表示する。
 * @param props バッジの表示内容
 * @returns 同期状態バッジ
 */
export function SyncBadge({ children, icon, tone = "default" }: SyncBadgeProps) {
  const toneClass = tone === "default" ? "" : `is-${tone}`;

  return (
    <span className={`sync-badge ${toneClass}`.trim()}>
      {icon}
      {children}
    </span>
  );
}
