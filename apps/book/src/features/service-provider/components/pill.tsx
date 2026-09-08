import { cn } from "@repo/ui/lib/utils";

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
