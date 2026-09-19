"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import {
  OrganizationFields,
  isOrganizationFieldsValid,
  initialOrganizationFieldsValue,
  type OrganizationFieldsValue,
} from "@/features/organization/components/organization-fields";
import { createDraftOrganization, searchAddress } from "../actions";

export function DraftOrgForm() {
  const tc = useTranslations("checkout");
  const [value, setValue] = useState<OrganizationFieldsValue>(initialOrganizationFieldsValue);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isValid = isOrganizationFieldsValid(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <OrganizationFields
        value={value}
        onChange={(key, next) => setValue((prev) => ({ ...prev, [key]: next }))}
        onSearchAddress={searchAddress}
        disabled={isPending}
        mapPreview={false}
        showIsOnBookWebsite={false}
      />

      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isPending || !isValid} className="w-full sm:w-auto">
        {isPending ? tc("creatingOrganization") : tc("continueToPayment")}
      </Button>
    </form>
  );
}
