"use client";

import { useState } from "react";
import { Slot } from "@repo/apis";
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
  Tiptap,
  toast,
} from "@repo/ui";
import { Pencil } from "@repo/ui/icons";
import { OccupationSelect } from "@repo/esco";
import type { BookingCategory } from "@repo/esco";
import { useTranslations } from "@repo/i18n";
import { createServiceProvider, updateServiceProvider } from "./actions";

interface ServiceProviderProfileProps {
  provider: Slot.ServiceProvider | null;
  categories: BookingCategory[];
  locale: string;
}

interface ProviderForm {
  firstName: string;
  lastName: string;
  occupationId: string;
  email: string;
  description: string;
}

const emptyForm: ProviderForm = {
  firstName: "",
  lastName: "",
  occupationId: "",
  email: "",
  description: "",
};

export function ServiceProviderProfile({
  provider,
  categories,
  locale,
}: ServiceProviderProfileProps) {
  const t = useTranslations("homepage.serviceProvider");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ProviderForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  const isEditing = !!provider;
  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.occupationId &&
    form.email.trim() &&
    form.description.trim();

  const openDialog = () => {
    setForm(
      provider
        ? {
            firstName: provider.firstName,
            lastName: provider.lastName,
            occupationId: provider.occupationId,
            email: provider.email ?? "",
            description: provider.description ?? "",
          }
        : emptyForm,
    );
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    const body = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      occupationId: form.occupationId,
      email: form.email.trim() || undefined,
      description: form.description,
    };
    try {
      if (provider) {
        await updateServiceProvider(provider.serviceProviderId, body);
      } else {
        await createServiceProvider(body);
      }
      setDialogOpen(false);
      setForm(emptyForm);
    } catch {
      toast(t("saveError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-md bg-muted/60 p-4 rounded-lg">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      {provider ? (
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <div className="flex flex-col">
            <p className="font-medium">
              {provider.firstName} {provider.lastName}
            </p>
            {provider.email && (
              <p className="text-xs text-muted-foreground">{provider.email}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={openDialog}>
            <Pencil className="size-4" />
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={openDialog}>
          {t("setup")}
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t("editTitle") : t("setupTitle")}
            </DialogTitle>
            <DialogDescription>{t("dialogDescription")}</DialogDescription>
          </DialogHeader>
          <ProviderFormFields
            form={form}
            setForm={setForm}
            categories={categories}
            locale={locale}
          />
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading || !isValid}>
              {loading ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProviderFormFields({
  form,
  setForm,
  categories,
  locale,
}: {
  form: ProviderForm;
  setForm: (form: ProviderForm) => void;
  categories: BookingCategory[];
  locale: string;
}) {
  const t = useTranslations("homepage.serviceProvider");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="provider-first-name">{t("firstName")}</Label>
          <Input
            id="provider-first-name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="provider-last-name">{t("lastName")}</Label>
          <Input
            id="provider-last-name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="provider-email">{t("email")}</Label>
        <Input
          id="provider-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("occupation")}</Label>
        <OccupationSelect
          categories={categories}
          locale={locale}
          value={form.occupationId}
          onChange={(occupationId) =>
            setForm({ ...form, occupationId: occupationId || "" })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("profileDescription")}</Label>
        <Tiptap
          content={form.description}
          onUpdate={(html) => setForm({ ...form, description: html })}
          className="w-full h-fit min-h-[60px] prose prose-sm"
        />
      </div>
    </div>
  );
}
