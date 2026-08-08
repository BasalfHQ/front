"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import type { Organization } from "../types";

export interface AuthButtonProps {
  organizations?: Organization[];
  onOrganizationChange?: (organizationId: string) => Promise<void>;
  loginText?: string;
  logoutText?: string;
  loadingText?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export function AuthButton({
  organizations = [],
  onOrganizationChange,
  loginText = "Login",
  logoutText = "Logout",
  loadingText = "Loading...",
  className,
  buttonClassName,
  dropdownClassName,
}: AuthButtonProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingOrg, setIsChangingOrg] = useState(false);

  if (status === "loading") {
    return (
      <div className={className}>
        <span>{loadingText}</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={className}>
        <button
          onClick={() => signIn()}
          className={buttonClassName}
        >
          {loginText}
        </button>
      </div>
    );
  }

  const currentOrg = organizations.find(
    (org) => org.organizationId === session.user.currentOrganization
  );

  const handleOrgChange = async (orgId: string) => {
    if (orgId === session.user.currentOrganization) {
      setIsOpen(false);
      return;
    }

    setIsChangingOrg(true);
    try {
      await onOrganizationChange?.(orgId);
    } finally {
      setIsChangingOrg(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={className}>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={buttonClassName}
          disabled={isChangingOrg}
        >
          {isChangingOrg
            ? loadingText
            : currentOrg?.name || session.user.email || "Account"}
        </button>

        {isOpen && (
          <div
            className={dropdownClassName}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              minWidth: "200px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              zIndex: 50,
            }}
          >
            {organizations.length > 0 && (
              <>
                <div
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                  }}
                >
                  Organizations
                </div>
                {organizations.map((org) => (
                  <button
                    key={org.organizationId}
                    onClick={() => handleOrgChange(org.organizationId)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "0.5rem 1rem",
                      backgroundColor:
                        org.organizationId === session.user.currentOrganization
                          ? "#f3f4f6"
                          : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {org.name}
                    {org.organizationId === session.user.currentOrganization && " ✓"}
                  </button>
                ))}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#e5e7eb",
                    margin: "0.25rem 0",
                  }}
                />
              </>
            )}
            <button
              onClick={() => signOut()}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#dc2626",
              }}
            >
              {logoutText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
