"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { File, Slot } from "@repo/apis";
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
  UploadFileButton,
  toast,
} from "@repo/ui";
import { Trash2 } from "@repo/ui/icons";
import { OccupationSelect } from "@repo/esco";
import type { BookingCategory } from "@repo/esco";
import { useTranslations } from "@repo/i18n";
import {
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProviderPicture,
  getFileUploadUrl,
} from "./actions";

interface ServiceProviderPicture {
  fileId: string;
  url: string;
}

interface ServiceProviderProfileProps {
  provider: Slot.ServiceProvider | null;
  picture: ServiceProviderPicture | null;
  categories: BookingCategory[];
  locale: string;
}

function ProviderAvatar({
  picture,
  initials,
  size,
  className = "",
}: {
  picture: ServiceProviderPicture | null;
  initials: string;
  size: number;
  className?: string;
}) {
  if (picture) {
    return (
      <Image
        src={picture.url}
        alt=""
        width={size}
        height={size}
        unoptimized={picture.url.startsWith("blob:")}
        className={`rounded-full object-cover border shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full border bg-muted font-medium text-muted-foreground shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

function initialsOf(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
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
  picture,
  categories,
  locale,
}: ServiceProviderProfileProps) {
  const t = useTranslations("homepage.serviceProvider");
  const tPicture = useTranslations("homepage.serviceProviderPicture");
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ProviderForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  // Shown right after a successful upload, ahead of the server confirming
  // it (the S3-event trigger that flips the file to "uploaded" is async
  // and can lag behind router.refresh()).
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayPicture = previewUrl
    ? { fileId: picture?.fileId ?? "", url: previewUrl }
    : picture;

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
        <button
          type="button"
          onClick={openDialog}
          className="flex items-center gap-3 rounded-lg border px-3 py-2 text-left cursor-pointer hover:bg-accent"
        >
          <ProviderAvatar
            picture={displayPicture}
            initials={initialsOf(provider.firstName, provider.lastName)}
            size={40}
          />
          <div className="flex flex-col">
            <p className="font-medium">
              {provider.firstName} {provider.lastName}
            </p>
            {provider.email && (
              <p className="text-xs text-muted-foreground">{provider.email}</p>
            )}
          </div>
        </button>
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
          {provider && (
            <div className="flex items-center gap-3">
              <ProviderAvatar
                picture={displayPicture}
                initials={initialsOf(provider.firstName, provider.lastName)}
                size={56}
              />
              <div className="flex gap-2">
                <UploadFileButton
                  variant="outline"
                  size="sm"
                  accept="image/png,image/jpeg,image/webp"
                  keyOverride={File.serviceProviderPictureKey(provider.serviceProviderId)}
                  getUploadUrl={getFileUploadUrl}
                  onUploaded={({ previewUrl: newPreview }) => {
                    setPreviewUrl((prev) => {
                      if (prev) URL.revokeObjectURL(prev);
                      return newPreview;
                    });
                    router.refresh();
                  }}
                  onError={() => toast(tPicture("uploadError"))}
                >
                  {displayPicture ? tPicture("change") : tPicture("add")}
                </UploadFileButton>
                {displayPicture && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      if (!picture) {
                        setPreviewUrl(null);
                        return;
                      }
                      try {
                        const deleted = await deleteServiceProviderPicture(
                          picture.fileId,
                        );
                        if (deleted) {
                          setPreviewUrl(null);
                          router.refresh();
                        } else {
                          toast(tPicture("deleteError"));
                        }
                      } catch {
                        toast(tPicture("deleteError"));
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
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
