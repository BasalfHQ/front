"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { AddressField } from "@/features/organization/components/address-field";
import {
  type OrganizationFieldsValue,
} from "@/features/organization/components/organization-fields";
import { LANGUAGES } from "@/features/organization/languages";
import { CURRENCIES } from "@/features/organization/currencies";
import { TIMEZONES } from "@/features/organization/timezones";
import { findRegion } from "@/features/organization/regions";
import type { AddressSuggestion } from "@/features/organization/mapbox";

// A soft-boxed "here's what we inferred, you can change it" row - used for
// both the language default and the currency/timezone summary so the two
// read as the same pattern instead of two bespoke widgets.
function InferredFact({
  sentence,
  adjustLabel,
  doneLabel,
  children,
}: {
  sentence: React.ReactNode;
  adjustLabel: string;
  doneLabel: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-md border bg-gray-50 px-3 py-2.5 text-sm motion-safe:transition-opacity motion-safe:duration-150">
      {!expanded ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-gray-700">{sentence}</p>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="shrink-0 text-gray-500 underline-offset-2 hover:underline"
          >
            {adjustLabel}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {children}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-gray-500 underline-offset-2 hover:underline"
          >
            {doneLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export function CheckoutOrganizationFields({
  value,
  onChange,
  onSearchAddress,
  disabled,
}: {
  value: OrganizationFieldsValue;
  onChange: <K extends keyof OrganizationFieldsValue>(
    key: K,
    next: OrganizationFieldsValue[K],
  ) => void;
  onSearchAddress: (query: string) => Promise<AddressSuggestion[]>;
  disabled?: boolean;
}) {
  const t = useTranslations("checkout");
  const to = useTranslations("organization");
  const locale = useLocale();
  const [regionCode, setRegionCode] = useState<string | undefined>();

  // Nobody needs to re-pick the language the page is already showing them
  // in, but it isn't purely cosmetic either - it's what booking-confirmation
  // emails (to the owner and to their customer) go out in - so it defaults
  // silently instead of being a control, but stays visible and correctable.
  useEffect(() => {
    onChange("language", locale);
    // Only ever want this to seed the default once, not fight a manual change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const region = findRegion(regionCode);
  const addressCountry = value.address?.addressCountry;

  useEffect(() => {
    if (!addressCountry || !region) return;
    onChange("currency", region.currency);
    onChange("timezone", region.timezones[0]!.id);
    // Re-derive only when a *different* address/region resolves - not on
    // every render, so an "Adjust" override isn't immediately clobbered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressCountry, regionCode]);

  const languageName = LANGUAGES.find((l) => l.code === value.language)?.name ?? value.language;

  return (
    <div className="space-y-7">
      <fieldset className="space-y-4" disabled={disabled}>
        <div>
          <legend className="text-[15px] font-semibold text-gray-900">
            {t("groupBusinessTitle")}
          </legend>
          <p id="group-business-note" className="text-sm text-gray-500">
            {t("groupBusinessNote")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-[13.5px] text-gray-600">
            {t("nameLabel")}
          </Label>
          <Input
            id="name"
            value={value.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder={t("namePlaceholder")}
            aria-describedby="group-business-note"
            disabled={disabled}
            className="h-[52px] max-w-[420px] text-[17px] font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13.5px] text-gray-600">
            {t("emailLabel")}
          </Label>
          <Input
            id="email"
            type="email"
            value={value.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder={t("emailPlaceholder")}
            disabled={disabled}
            className="max-w-[380px]"
          />
          <p className="text-xs text-gray-500">{t("emailHelp")}</p>
        </div>
      </fieldset>

      <div className="border-t" />

      <fieldset className="space-y-4" disabled={disabled}>
        <div>
          <legend className="text-[15px] font-semibold text-gray-900">
            {t("groupLocationTitle")}
          </legend>
          <p id="group-location-note" className="text-sm text-gray-500">
            {t("groupLocationNote")}
          </p>
        </div>

        <div className="sm:w-[420px]">
          <AddressField
            id="address"
            value={value.address}
            onChange={(address) => onChange("address", address)}
            onSearch={onSearchAddress}
            onCountryCode={setRegionCode}
            disabled={disabled}
          />
        </div>

        {value.address && (
          <InferredFact
            sentence={
              region
                ? t("regionalSummary", {
                    currency: region.currency,
                    city: region.timezones[0]!.city,
                  })
                : t("regionalSummaryUnknown")
            }
            adjustLabel={t("adjust")}
            doneLabel={t("done")}
          >
            <div className="space-y-2">
              <Label htmlFor="currency-select" className="text-xs text-gray-600">
                {to("currency")}
              </Label>
              <Select
                value={value.currency}
                onValueChange={(next) => onChange("currency", next)}
                disabled={disabled}
              >
                <SelectTrigger id="currency-select">
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
            <div className="space-y-2">
              <Label htmlFor="timezone-select" className="text-xs text-gray-600">
                {to("timezone")}
              </Label>
              <Select
                value={value.timezone}
                onValueChange={(next) => onChange("timezone", next)}
                disabled={disabled}
              >
                <SelectTrigger id="timezone-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(region?.timezones.map((z) => z.id) ?? TIMEZONES).map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {region?.timezones.find((z) => z.id === tz)?.label ?? tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </InferredFact>
        )}

        <InferredFact
          sentence={t("languageSummary", { language: languageName })}
          adjustLabel={t("languageAdjust")}
          doneLabel={t("done")}
        >
          <Label htmlFor="language-select" className="text-xs text-gray-600">
            {t("languageLabel")}
          </Label>
          <Select
            value={value.language}
            onValueChange={(next) => onChange("language", next)}
            disabled={disabled}
          >
            <SelectTrigger id="language-select">
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
        </InferredFact>
      </fieldset>
    </div>
  );
}
