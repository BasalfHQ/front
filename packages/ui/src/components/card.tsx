import Link from "next/link";
import { cn } from "../lib/utils";
import React from "react";

export function Card({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const PotentialLink = href ? Link : React.Fragment;
  return (
    <PotentialLink href={href ?? ""} prefetch={true}>
      <div
        className={cn(
          "flex flex-col gap-1 rounded-md border p-4 w-fit justify-between bg-accent/50",
          href && "hover:bg-accent/80",
          className,
        )}
      >
        {children}
      </div>
    </PotentialLink>
  );
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
