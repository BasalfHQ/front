"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { PageTitle } from "@repo/ui";
import { createOrganization, searchAddress } from "../actions";
import {
  AdminOrganizationFields,
  isOrganizationFieldsValid,
  initialOrganizationFieldsValue,
  type OrganizationFieldsValue,
} from "./organization-fields";

export function CreateOrgForm() {
  const t = useTranslations("organization");
  const [value, setValue] = useState<OrganizationFieldsValue>(initialOrganizationFieldsValue);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValid = isOrganizationFieldsValid(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await createOrganization(
        value.name,
        value.timezone,
        value.email,
        value.language,
        value.address,
        value.isOnBookWebsite,
        value.currency,
      );

      if (result.success && result.organization) {
        setSuccess(t("createdSuccess", { name: result.organization.name }));
        setValue(initialOrganizationFieldsValue);
      } else {
        setError(result.error || "Failed to create organization");
      }
    });
  };

  return (
    <>
      <PageTitle className="mb-6">{t("title")}</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-2xl">
        <AdminOrganizationFields
          value={value}
          onChange={(key, next) => setValue((prev) => ({ ...prev, [key]: next }))}
          onSearchAddress={searchAddress}
          disabled={isPending}
        />

        {error && (
          <p role="alert" aria-live="polite" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p role="status" aria-live="polite" className="text-sm text-green-600">
            {success}
          </p>
        )}

        <Button type="submit" disabled={isPending || !isValid}>
          {isPending ? t("creating") : t("createOrganization")}
        </Button>
      </form>
    </>
  );
}
