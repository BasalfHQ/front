import { cn } from "@repo/ui/lib/utils";

export function PageTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
}

export function PageDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-muted-foreground", className)}>{children}</p>
  );
}
