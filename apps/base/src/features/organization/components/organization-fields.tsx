"use client";

import { useTranslations } from "next-intl";
import { Base } from "@repo/apis";
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
import { AddressField } from "./address-field";
import { LANGUAGES } from "../languages";
import { TIMEZONES } from "../timezones";
import { CURRENCIES } from "../currencies";
import type { AddressSuggestion } from "../mapbox";

// Shape + validation are shared by the admin CreateOrgForm and the public
// checkout DraftOrgForm. The JSX isn't: an admin CRUD form and a pre-payment
// conversion form want different things, so each gets its own layout -
// AdminOrganizationFields here (unchanged grid), CheckoutOrganizationFields
// in features/checkout.
export type OrganizationFieldsValue = {
  name: string;
  email: string;
  timezone: string;
  language: string;
  currency: string;
  address: Base.Address | undefined;
  isOnBookWebsite: boolean;
};

export const initialOrganizationFieldsValue: OrganizationFieldsValue = {
  name: "",
  email: "",
  timezone: "Europe/Paris",
  language: "fr",
  currency: "EUR",
  address: undefined,
  isOnBookWebsite: false,
};

export function isOrganizationFieldsValid(value: OrganizationFieldsValue): boolean {
  // Coordinates are required - orgs need a real, geocoded address (used for
  // slot-mgt-bff's service-provider location, the booking page map pin, and
  // SEO structured data), so the address can only come from picking a
  // Mapbox suggestion, never free text. postalCode/addressLocality stay
  // optional: Mapbox sometimes omits that context for an otherwise-valid,
  // geocoded result, and that gap shouldn't make the form unsubmittable.
  return !!(
    value.name.trim() &&
    value.email.trim() &&
    value.address?.streetAddress?.trim() &&
    value.address?.addressCountry?.trim() &&
    value.address?.latitude != null &&
    value.address?.longitude != null
  );
}

export function AdminOrganizationFields({
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
  const t = useTranslations("organization");

  return (
    <>
      {/* Fixed-size tracks, not 1fr - keeps inputs a normal reading width
          even though the page around this form has no max-w container. */}
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(0,320px))] gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("organizationName")}</Label>
          <Input
            id="name"
            value={value.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder={t("enterName")}
            required
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={value.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder={t("enterEmail")}
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(3,minmax(0,220px))] gap-4">
        <div className="space-y-2">
          <Label htmlFor="language-select">{t("language")}</Label>
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone-select">{t("timezone")}</Label>
          <Select
            value={value.timezone}
            onValueChange={(next) => onChange("timezone", next)}
            disabled={disabled}
          >
            <SelectTrigger id="timezone-select">
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
          <Label htmlFor="currency-select">{t("currency")}</Label>
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
      </div>

      <fieldset disabled={disabled} className="sm:w-[420px]">
        <AddressField
          id="address"
          value={value.address}
          onChange={(address) => onChange("address", address)}
          onSearch={onSearchAddress}
          disabled={disabled}
        />
      </fieldset>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is-on-book-website"
          checked={value.isOnBookWebsite}
          onCheckedChange={(checked) => onChange("isOnBookWebsite", checked === true)}
          disabled={disabled}
        />
        <Label htmlFor="is-on-book-website">{t("isOnBookWebsite")}</Label>
      </div>
    </>
  );
}
