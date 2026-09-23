"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Organization } from "../types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

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

  const handleChange = async (newOrgId: string) => {
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
    <Select
      value={session?.user.currentOrganization || ""}
      onValueChange={handleChange}
      disabled={isChanging}
    >
      <SelectTrigger className={cn("min-w-[150px]", className)}>
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.organizationId} value={org.organizationId}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
