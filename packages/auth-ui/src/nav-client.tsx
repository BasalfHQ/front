"use client";

import type { Organization } from "@repo/auth";
import { LoginModal, OrganizationSelect } from "@repo/auth/components";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Query-param driven (?login=true), so it must only ever mount once - unlike
// NavAuthSlot below, this can't be rendered in both the desktop bar and the
// mobile drawer, or two Dialogs would fight over the same open state.
export function NavLoginModal() {
  return <LoginModal />;
}

interface NavAuthSlotProps {
  isLoggedIn: boolean;
  organizations: Organization[];
  className?: string;
}

// Safe to render more than once (e.g. once in the desktop bar, once in the
// mobile drawer) - none of this reads state that two mounts would fight
// over, unlike NavLoginModal.
export function NavAuthSlot({ isLoggedIn, organizations, className }: NavAuthSlotProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const handleOrganizationChange = async (organizationId: string) => {
    const response = await fetch("/api/auth/organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    });

    if (response.ok) {
      const { tokens } = await response.json();
      await update(tokens);
      router.refresh();
    }
  };

  const openLoginModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("login", "true");
    router.push(`${pathname}?${params}`);
  };

  if (!isLoggedIn) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <LocaleSwitcher />
        <Button variant="outline" onClick={openLoginModal}>
          {t("login")}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <OrganizationSelect
        organizations={organizations}
        onOrganizationChange={handleOrganizationChange}
        className={className ? "w-full" : undefined}
      />
      <LocaleSwitcher className={className ? "w-full" : undefined} />
      <Button
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/" })}
        className={className ? "w-full" : undefined}
      >
        {t("logout")}
      </Button>
    </div>
  );
}
