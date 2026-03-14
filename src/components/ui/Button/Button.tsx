import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center tracking-widest uppercase transition-all duration-200 font-body",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Variantes
          "bg-[#111111] text-white hover:bg-[#111111]/80":
            variant === "primary",
          "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white":
            variant === "secondary",
          "underline underline-offset-4 text-[#111111] hover:text-[#111111]/60":
            variant === "ghost",
          // Tamanhos
          "text-[10px] px-5 py-2": size === "sm",
          "text-xs px-8 py-3": size === "md",
          "text-xs px-10 py-4": size === "lg",
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
