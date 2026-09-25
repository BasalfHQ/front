import { cn } from "@repo/ui/lib/utils";
import { checkoutUrl } from "../paths";

const sizes = {
  sm: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base lg:min-h-[52px] lg:px-8 lg:text-[17px]",
};

// Signup CTA: checkout page of the base app.
export function CtaLink({
  locale,
  label,
  size = "lg",
  className,
}: {
  locale: string;
  label: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <a
      href={checkoutUrl(locale)}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground no-underline shadow-sm hover:bg-primary/90",
        sizes[size],
        className,
      )}
    >
      {label}
    </a>
  );
}
