/** アイコンだけで操作する小型ボタンの共通表現を提供するファイル。 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

/** `IconButton` に渡すアイコンと見た目の種別。 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tone?: "default" | "check" | "danger";
}

/**
 * アイコンのみを表示する共通ボタンを描画する。
 * @param props ボタン表示に必要な属性
 * @returns アイコンボタン
 */
export function IconButton({ className = "", icon, tone = "default", ...props }: IconButtonProps) {
  const toneClass = tone === "default" ? "" : `${tone}-button`;

  return (
    <button className={`icon-button ${toneClass} ${className}`.trim()} type="button" {...props}>
      {icon}
    </button>
  );
}
