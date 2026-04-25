import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tone?: "default" | "check" | "danger";
}

export function IconButton({ className = "", icon, tone = "default", ...props }: IconButtonProps) {
  const toneClass = tone === "default" ? "" : `${tone}-button`;

  return (
    <button className={`icon-button ${toneClass} ${className}`.trim()} type="button" {...props}>
      {icon}
    </button>
  );
}
