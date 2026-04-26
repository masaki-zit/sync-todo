/** ラベル付きアクションボタンの共通表現を提供するファイル。 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

/** `ActionButton` に渡す表示要素と見た目のバリエーション。 */
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "primary" | "secondary";
}

/**
 * アイコンとラベルを持つ共通ボタンを表示する。
 * @param props ボタン表示に必要な属性
 * @returns アクションボタン
 */
export function ActionButton({ children, className = "", icon, variant = "primary", ...props }: ActionButtonProps) {
  return (
    <button className={`${variant}-button ${className}`.trim()} type="button" {...props}>
      {icon}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
