import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16",
        className
      )}
    >
      {children}
    </Tag>
  );
}
