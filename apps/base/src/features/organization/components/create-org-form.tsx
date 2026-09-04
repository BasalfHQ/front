"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
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
import { LANGUAGES } from "../languages";
import { TIMEZONES } from "../timezones";

export function CreateOrgForm() {
  const t = useTranslations("organization");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [language, setLanguage] = useState("fr");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [addressLocality, setAddressLocality] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [isOnBookWebsite, setIsOnBookWebsite] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValid =
    name.trim() &&
    email.trim() &&
    streetAddress.trim() &&
    addressLocality.trim() &&
    postalCode.trim() &&
    addressCountry.trim();

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
        {
          streetAddress: streetAddress.trim(),
          streetNumber: streetNumber.trim() || undefined,
          addressLocality: addressLocality.trim(),
          postalCode: postalCode.trim(),
          addressCountry: addressCountry.trim(),
        },
        isOnBookWebsite,
      );

      if (result.success && result.organization) {
        setSuccess(t("createdSuccess", { name: result.organization.name }));
        setName("");
        setEmail("");
        setTimezone("Europe/Paris");
        setLanguage("fr");
        setStreetAddress("");
        setStreetNumber("");
        setAddressLocality("");
        setPostalCode("");
        setAddressCountry("");
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <fieldset className="space-y-3" disabled={isPending}>
          <Label className="text-base font-medium">{t("address")}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="street-number">{t("streetNumber")}</Label>
              <Input
                id="street-number"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="street-address">{t("streetAddress")}</Label>
              <Input
                id="street-address"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="postal-code">{t("postalCode")}</Label>
              <Input
                id="postal-code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t("addressLocality")}</Label>
              <Input
                id="city"
                value={addressLocality}
                onChange={(e) => setAddressLocality(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t("addressCountry")}</Label>
              <Input
                id="country"
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
                required
              />
            </div>
          </div>
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
