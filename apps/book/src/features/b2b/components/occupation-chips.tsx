import Link from "next/link";

// No href: not live yet, shown as plain text (never link to a 404).
export type OccupationLink = { label: string; href?: string | null };

const chip =
  "flex min-h-11 items-center rounded-full border px-4 text-sm font-medium lg:px-[18px]";

// Pill links to occupation / category pages ("Also for", hubs).
export function OccupationChips({ links }: { links: OccupationLink[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0 lg:gap-2.5">
      {links.map((link) => (
        <li key={link.label}>
          {link.href ? (
            <Link
              href={link.href}
              className={`${chip} border-input bg-card text-foreground no-underline hover:border-foreground/40`}
            >
              {link.label}
            </Link>
          ) : (
            <span className={`${chip} border-border text-muted-foreground`}>
              {link.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
