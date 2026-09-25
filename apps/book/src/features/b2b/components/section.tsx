import { cn } from "@repo/ui/lib/utils";

// Page width of the B2B pages (design: 1024px content, 20px/24px gutters).
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1024px] px-5 lg:px-6", className)}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "flex flex-col gap-5 border-t border-border py-12 lg:gap-7 lg:py-[72px]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "m-0 text-[28px] font-bold leading-[1.2] tracking-[-0.01em] lg:text-[32px] lg:leading-[1.15] lg:tracking-[-0.015em]",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
