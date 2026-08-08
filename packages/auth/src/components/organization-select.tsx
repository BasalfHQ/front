"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Organization } from "../types";

export interface OrganizationSelectProps {
  organizations: Organization[];
  onOrganizationChange: (organizationId: string) => Promise<void>;
  className?: string;
}

export function OrganizationSelect({
  organizations,
  onOrganizationChange,
  className,
}: OrganizationSelectProps) {
  const { data: session } = useSession();
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrgId = e.target.value;
    if (newOrgId === session?.user.currentOrganization) return;

    setIsChanging(true);
    try {
      await onOrganizationChange(newOrgId);
    } finally {
      setIsChanging(false);
    }
  };

  if (organizations.length === 0) return null;

  return (
    <select
      value={session?.user.currentOrganization || ""}
      onChange={handleChange}
      disabled={isChanging}
      className={className}
      style={{
        padding: "0.5rem",
        borderRadius: "0.375rem",
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        cursor: isChanging ? "wait" : "pointer",
      }}
    >
      {!session?.user.currentOrganization && (
        <option value="" disabled>
          Select organization
        </option>
      )}
      {organizations.map((org) => (
        <option key={org.organizationId} value={org.organizationId}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
