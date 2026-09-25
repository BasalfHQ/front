"use client";

import { useEffect, useState } from "react";
import { cn } from "@repo/ui/lib/utils";

// Mobile-only CTA bar, shown once the element `afterId` (the hero) is scrolled past.
export function StickyCta({
  href,
  label,
  afterId,
}: {
  href: string;
  label: string;
  afterId: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(afterId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(
        !entry.isIntersecting && entry.boundingClientRect.bottom < 0,
      ),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [afterId]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-5 pb-4 pt-3 backdrop-blur transition-[transform,opacity] duration-200 ease-out lg:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      )}
    >
      <a
        href={href}
        tabIndex={visible ? undefined : -1}
        className="flex min-h-12 items-center justify-center rounded-md bg-primary px-6 font-semibold text-primary-foreground no-underline shadow-sm"
      >
        {label}
      </a>
    </div>
  );
}
