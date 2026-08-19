import Link from "next/link";
import { cn } from "../lib/utils";
import React from "react";

type CardVariant = "default" | "success" | "destructive";

export function Card({
  children,
  className,
  href,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: CardVariant;
}) {
  const bg = {
    default: "bg-accent/50",
    success: "bg-success/15",
    destructive: "bg-destructive/15",
  };
  const borderColor = {
    default: "border-accent",
    success: "border-transparent",
    destructive: "border-transparent",
  };
  const content = (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border p-4 w-fit justify-between",
        bg[variant],
        borderColor[variant],
        href && "hover:bg-accent/80",
        className,
      )}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} prefetch>
        {content}
      </Link>
    );
  }

  return content;
}
export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}
