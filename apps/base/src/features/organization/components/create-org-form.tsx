"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { PageTitle } from "@repo/ui";
import { createOrganization } from "../actions";
import { TIMEZONES } from "../timezones";

export function CreateOrgForm() {
  const t = useTranslations("organization");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await createOrganization(name, timezone);

      if (result.success && result.organization) {
        setSuccess(t("createdSuccess", { name: result.organization.name }));
        setName("");
        setTimezone("Europe/Paris");
      } else {
        setError(result.error || "Failed to create organization");
      }
    });
  };

  return (
    <>
      <PageTitle className="mb-6">{t("title")}</PageTitle>

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

        <div className="space-y-2">
          <Label>{t("timezone")}</Label>
          <Select value={timezone} onValueChange={setTimezone} disabled={isPending}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
