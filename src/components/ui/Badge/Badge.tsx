import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "sale" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-[9px] tracking-widest uppercase px-2 py-1 font-body",
        {
          "bg-[#111111] text-white": variant === "new",
          "bg-[#C8A882] text-white": variant === "sale",
          "bg-[#F5F5F5] text-[#111111]": variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
