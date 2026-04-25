import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "primary" | "secondary";
}

export function ActionButton({ children, className = "", icon, variant = "primary", ...props }: ActionButtonProps) {
  return (
    <button className={`${variant}-button ${className}`.trim()} type="button" {...props}>
      {icon}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
