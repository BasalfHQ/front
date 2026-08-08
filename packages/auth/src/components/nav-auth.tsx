"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthButton } from "./auth-button";
import type { Organization } from "../types";

export interface NavAuthProps {
  fetchOrganizations: (email: string) => Promise<Organization[]>;
  onOrganizationChange?: (organizationId: string) => Promise<void>;
  loginText?: string;
  logoutText?: string;
}

export function NavAuth({
  fetchOrganizations,
  onOrganizationChange,
  loginText,
  logoutText,
}: NavAuthProps) {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrganizations(session.user.email).then(setOrganizations);
    }
  }, [session?.user?.email, fetchOrganizations]);

  return (
    <AuthButton
      organizations={organizations}
      onOrganizationChange={onOrganizationChange}
      loginText={loginText}
      logoutText={logoutText}
    />
  );
}
