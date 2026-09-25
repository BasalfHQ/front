import Link from "next/link";
import { ChevronRight } from "@repo/ui/icons";

export type Crumb = { label: string; href: string };

// Last crumb is the current page (not a link).
export function Breadcrumbs({
  label,
  crumbs,
}: {
  label: string;
  crumbs: Crumb[];
}) {
  return (
    <nav aria-label={label}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-1.5 p-0 text-sm text-muted-foreground">
        {crumbs.map((crumb, i) =>
          i < crumbs.length - 1 ? (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <Link
                href={crumb.href}
                className="inline-flex min-h-11 items-center text-muted-foreground no-underline hover:text-foreground"
              >
                {crumb.label}
              </Link>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
            </li>
          ) : (
            <li
              key={crumb.href}
              aria-current="page"
              className="flex min-h-11 items-center font-medium text-foreground"
            >
              {crumb.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
