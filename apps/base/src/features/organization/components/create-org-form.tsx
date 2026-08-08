"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { createOrganization } from "../actions";

export function CreateOrgForm() {
  const t = useTranslations("organization");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await createOrganization(name);

      if (result.success && result.organization) {
        setSuccess(t("createdSuccess", { name: result.organization.name }));
        setName("");
      } else {
        setError(result.error || "Failed to create organization");
      }
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="space-y-2">
          <Label htmlFor="name">{t("organizationName")}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("enterName")}
            required
            disabled={isPending}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <Button type="submit" disabled={isPending || !name.trim()}>
          {isPending ? t("creating") : t("createOrganization")}
        </Button>
      </form>
    </>
  );
}
