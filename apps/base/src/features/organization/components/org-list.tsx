"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Organization } from "@repo/apis";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Pencil } from "@repo/ui/icons";
import { updateOrganization } from "../actions";
import { LANGUAGES } from "../languages";
import { TIMEZONES } from "../timezones";

export function OrgList({ organizations }: { organizations: Organization[] }) {
  const t = useTranslations("organization");
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editingOrg || !name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const result = await updateOrganization({
        organizationId: editingOrg.organizationId,
        name: name.trim(),
        email: email.trim(),
        timezone,
        ...(language && { language }),
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingOrg(org);
                  setName(org.name);
                  setEmail(org.email ?? "");
                  setTimezone(org.timezone);
                  setLanguage(org.language ?? "");
                }}
              >
                <Pencil className="size-4" />
              </Button>
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
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdate}
              disabled={loading || !name.trim() || !email.trim()}
            >
              {loading ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
