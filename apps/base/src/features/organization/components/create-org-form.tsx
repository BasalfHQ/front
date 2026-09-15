"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Base } from "@repo/apis";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui";
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
import { AddressField } from "./address-field";
import { LANGUAGES } from "../languages";
import { TIMEZONES } from "../timezones";
import { CURRENCIES } from "../currencies";

export function CreateOrgForm() {
  const t = useTranslations("organization");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [language, setLanguage] = useState("fr");
  const [currency, setCurrency] = useState("EUR");
  const [address, setAddress] = useState<Base.Address | undefined>();
  const [isOnBookWebsite, setIsOnBookWebsite] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValid =
    name.trim() &&
    email.trim() &&
    address?.streetAddress?.trim() &&
    address?.addressLocality?.trim() &&
    address?.postalCode?.trim() &&
    address?.addressCountry?.trim() &&
    address?.latitude != null &&
    address?.longitude != null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await createOrganization(
        name,
        timezone,
        email,
        language,
        address,
        isOnBookWebsite,
        currency,
      );

      if (result.success && result.organization) {
        setSuccess(t("createdSuccess", { name: result.organization.name }));
        setName("");
        setEmail("");
        setTimezone("Europe/Paris");
        setLanguage("fr");
        setCurrency("EUR");
        setAddress(undefined);
        setIsOnBookWebsite(false);
      } else {
        setError(result.error || "Failed to create organization");
      }
    });
  };

  return (
    <>
      <PageTitle className="mb-6">{t("title")}</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enterEmail")}
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{t("language")}</Label>
            <Select value={language} onValueChange={setLanguage} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <div className="space-y-2">
            <Label>{t("currency")}</Label>
            <Select value={currency} onValueChange={setCurrency} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <fieldset disabled={isPending}>
          <AddressField id="address" value={address} onChange={setAddress} disabled={isPending} />
        </fieldset>

        <div className="flex items-center gap-2">
          <Checkbox
            id="is-on-book-website"
            checked={isOnBookWebsite}
            onCheckedChange={(checked) =>
              setIsOnBookWebsite(checked === true)
            }
            disabled={isPending}
          />
          <Label htmlFor="is-on-book-website">{t("isOnBookWebsite")}</Label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <Button type="submit" disabled={isPending || !isValid}>
          {isPending ? t("creating") : t("createOrganization")}
        </Button>
      </form>
    </>
  );
}
