import Image from "next/image";
import { cn } from "../lib/utils";
import { TypeBadge, type BookableType } from "./badge";

export interface BookableCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  type: BookableType;
  typeLabel: string;
  unitLine: string;
  price: string;
  availabilityLine: string;
  onClick?: () => void;
  className?: string;
}

export function BookableCard({
  imageUrl,
  imageAlt,
  title,
  type,
  typeLabel,
  unitLine,
  price,
  availabilityLine,
  onClick,
  className,
}: BookableCardProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-colors",
        onClick &&
          "hover:border-plum focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/15",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <TypeBadge type={type}>{typeLabel}</TypeBadge>
        <p className="font-serif text-lg text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{unitLine}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono font-medium text-foreground">{price}</span>
          <span className="text-jade-text">{availabilityLine}</span>
        </div>
      </div>
    </Comp>
  );
}
