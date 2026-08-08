"use client";

import type { Organization } from "@repo/auth";
import { LoginModal, OrganizationSelect } from "@repo/auth/components";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@repo/ui/button";
import { signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface NavAuthSlotProps {
  isLoggedIn: boolean;
  organizations: Organization[];
}

export function NavAuthSlot({ isLoggedIn, organizations }: NavAuthSlotProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleOrganizationChange = async (organizationId: string) => {
    const response = await fetch("/api/auth/organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    });

    if (response.ok) {
      window.location.reload();
    }
  };

  const openLoginModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("login", "true");
    router.push(`${pathname}?${params}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <LoginModal />
        <LocaleSwitcher />
        <Button variant="outline" onClick={openLoginModal}>
          {t("login")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <LoginModal />
      <div className="flex items-center gap-2">
        <OrganizationSelect
          organizations={organizations}
          onOrganizationChange={handleOrganizationChange}
        />
        <LocaleSwitcher />
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          {t("logout")}
        </Button>
      </div>
    </>
  );
}
