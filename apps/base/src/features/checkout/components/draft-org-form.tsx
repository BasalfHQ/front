"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import {
  initialOrganizationFieldsValue,
  type OrganizationFieldsValue,
} from "@/features/organization/components/organization-fields";
import { CheckoutOrganizationFields } from "./checkout-organization-fields";
import { createDraftOrganization, searchAddress } from "../actions";

function firstInvalidField(
  value: OrganizationFieldsValue,
): { id: string; messageKey: string } | null {
  if (!value.name.trim()) return { id: "name", messageKey: "errorNameRequired" };
  if (!value.email.trim()) return { id: "email", messageKey: "errorEmailRequired" };
  if (!value.address?.streetAddress?.trim() || value.address?.latitude == null) {
    return { id: "address", messageKey: "errorAddressRequired" };
  }
  return null;
}

export function DraftOrgForm() {
  const tc = useTranslations("checkout");
  const [value, setValue] = useState<OrganizationFieldsValue>(initialOrganizationFieldsValue);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = firstInvalidField(value);
    if (invalid) {
      setError(tc(invalid.messageKey));
      document.getElementById(invalid.id)?.focus();
      return;
    }
    setError("");

    startTransition(async () => {
      const result = await createDraftOrganization({
        name: value.name,
        timezone: value.timezone,
        email: value.email,
        language: value.language,
        currency: value.currency,
        // No toggle in this flow yet - every org created through checkout
        // is listed on the book website for now.
        isOnBookWebsite: true,
        address: value.address,
      });
      // A success just redirects server-side and never returns here.
      if (result && !result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 w-full">
      <CheckoutOrganizationFields
        value={value}
        onChange={(key, next) => setValue((prev) => ({ ...prev, [key]: next }))}
        onSearchAddress={searchAddress}
        disabled={isPending}
      />

      <div className="space-y-2">
        {error && (
          <p role="alert" aria-live="polite" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? tc("creatingOrganization") : tc("continueToPayment")}
        </Button>
        <p className="text-xs text-gray-500">{tc("submitNote")}</p>
      </div>
    </form>
  );
}
