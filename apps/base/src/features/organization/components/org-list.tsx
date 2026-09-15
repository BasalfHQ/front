"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Base } from "@repo/apis";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Checkbox,
  Input,
  Label,
  toast,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Globe, Pencil } from "@repo/ui/icons";
import { updateOrganization } from "../actions";
import { AddressField } from "./address-field";
import { LANGUAGES } from "../languages";
import { TIMEZONES } from "../timezones";
import { CURRENCIES } from "../currencies";

export function OrgList({ organizations }: { organizations: Base.Organization[] }) {
  const t = useTranslations("organization");
  const [editingOrg, setEditingOrg] = useState<Base.Organization | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [address, setAddress] = useState<Base.Address | undefined>();
  const [isOnBookWebsite, setIsOnBookWebsite] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid =
    name.trim() &&
    email.trim() &&
    address?.streetAddress?.trim() &&
    address?.addressLocality?.trim() &&
    address?.postalCode?.trim() &&
    address?.addressCountry?.trim() &&
    address?.latitude != null &&
    address?.longitude != null;

  const handleUpdate = async () => {
    if (!editingOrg || !isValid) return;
    setLoading(true);
    try {
      const result = await updateOrganization({
        organizationId: editingOrg.organizationId,
        name: name.trim(),
        email: email.trim(),
        timezone,
        isOnBookWebsite,
        ...(language && { language }),
        ...(currency && { currency }),
        address,
      });
      if (result.success) {
        setEditingOrg(null);
      } else {
        toast(result.error || t("updateFailed"));
      }
    } catch {
      toast(t("updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {t("existingOrganizations")}
      </h2>
      {organizations.length === 0 ? (
        <p className="text-gray-500">{t("noOrganizations")}</p>
      ) : (
        <ul className="space-y-2">
          {organizations.map((org) => (
            <li
              key={org.organizationId}
              className="p-3 border rounded flex items-center justify-between"
            >
              <div>
                {org.language && (
                  <span className="mr-2">
                    {LANGUAGES.find((l) => l.code === org.language)?.flag}
                  </span>
                )}
                <span className="font-medium">{org.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  ({org.organizationId})
                </span>
                {org.email && (
                  <span className="text-gray-500 text-sm ml-2">
                    {org.email}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Globe
                  className={`size-4 ${org.isOnBookWebsite ? "text-green-500" : "text-gray-300"}`}
                />
                <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingOrg(org);
                  setName(org.name);
                  setEmail(org.email ?? "");
                  setTimezone(org.timezone);
                  setLanguage(org.language ?? "");
                  setCurrency(org.currency ?? "");
                  setAddress(org.address);
                  setIsOnBookWebsite(org.isOnBookWebsite);
                }}
              >
                <Pencil className="size-4" />
              </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={!!editingOrg}
        onOpenChange={(open) => {
          if (!open) setEditingOrg(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editOrganization")}</DialogTitle>
            <DialogDescription>{t("editDescription")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-org-name">{t("organizationName")}</Label>
              <Input
                id="edit-org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-org-email">{t("email")}</Label>
              <Input
                id="edit-org-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("language")}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectLanguage")} />
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
            <div className="flex flex-col gap-2">
              <Label>{t("timezone")}</Label>
              <Select value={timezone} onValueChange={setTimezone}>
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
            <div className="flex flex-col gap-2">
              <Label>{t("currency")}</Label>
              <Select value={currency} onValueChange={setCurrency}>
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
            <AddressField id="edit-address" value={address} onChange={setAddress} />
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-is-on-book-website"
                checked={isOnBookWebsite}
                onCheckedChange={(checked) =>
                  setIsOnBookWebsite(checked === true)
                }
              />
              <Label htmlFor="edit-is-on-book-website">
                {t("isOnBookWebsite")}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={loading || !isValid}>
              {loading ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
