"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Link } from "@repo/i18n";
import { cn } from "../lib/utils";

export type NavItem = {
  label: string;
  href: string;
  adminOnly?: boolean;
  authOnly?: boolean;
  // A small dot next to the label - for "something here needs your
  // attention" (e.g. no slots configured yet), not for unread counts.
  badge?: boolean;
  subItems?: NavItem[];
};

export interface NavProps {
  navItems?: NavItem[];
  authSlot?: React.ReactNode;
  // Rendered inside the mobile drawer instead of authSlot - same underlying
  // controls (org switch, locale, login/logout), just laid out flex-col
  // w-full for a full-width sheet instead of a row in the top bar. Kept as a
  // separate prop rather than one node moved by CSS, since it needs its own
  // className passed down to the actual buttons/selects, not just a wrapper.
  mobileAuthSlot?: React.ReactNode;
}

const logoHref =
  process.env.NEXT_PUBLIC_STAGE === "prod" ? "https://basalf.com" : "http://localhost:3000";

const NavUi = ({
  label,
  href,
  badge,
  onNavigate,
  className,
}: {
  label: string;
  href: string;
  badge?: boolean;
  onNavigate?: () => void;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn("relative hover:underline text-gray-700", className)}
    >
      {label}
      {badge && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-0.5 h-1.5 w-1.5 rounded-full bg-destructive"
        />
      )}
    </Link>
  );
};

export function Nav({ navItems, authSlot, mobileAuthSlot }: NavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b w-full">
      <div className="flex items-center gap-4 md:gap-10">
        <Link href={logoHref}>
          <Image src="/logo.png" alt="Basalf" width={60} height={60} />
        </Link>
        {/* Links row only shows once there's room next to the logo - below
            that width they'd overflow the bar instead of wrapping cleanly,
            so they move into the drawer triggered by the hamburger. */}
        <div className="hidden md:flex gap-4 pt-2">
          {navItems?.map((item) => (
            <NavUi key={item.href} label={item.label} href={item.href} badge={item.badge} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">{authSlot}</div>

        {((navItems && navItems.length > 0) || mobileAuthSlot) && (
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden" />
              <DialogPrimitive.Content
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] w-full flex-col gap-1 rounded-t-xl border-t bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lg duration-200",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                  "md:hidden",
                )}
              >
                <div className="mx-auto mb-2 h-1.5 w-10 shrink-0 rounded-full bg-muted" />
                <div className="flex items-center justify-between pb-4">
                  <DialogPrimitive.Title className="text-sm font-medium text-muted-foreground">
                    Menu
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close
                    aria-label="Close menu"
                    className="rounded-sm p-1 opacity-70 hover:opacity-100"
                  >
                    <X className="h-5 w-5" />
                  </DialogPrimitive.Close>
                </div>
                <div className="flex flex-col overflow-y-auto">
                  {navItems?.map((item) => (
                    <NavUi
                      key={item.href}
                      label={item.label}
                      href={item.href}
                      badge={item.badge}
                      onNavigate={() => setOpen(false)}
                      className="py-2 text-base"
                    />
                  ))}
                  {mobileAuthSlot && (
                    <div className="mt-2 flex flex-col gap-2 border-t pt-4">
                      {mobileAuthSlot}
                    </div>
                  )}
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        )}
      </div>
    </nav>
  );
}
