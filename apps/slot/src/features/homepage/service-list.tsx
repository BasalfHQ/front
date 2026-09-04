"use client";

import { useState } from "react";
import { Service } from "@repo/apis";
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
import { Plus, Pencil, Trash2, FileText, X } from "@repo/ui/icons";
import { useTranslations } from "@repo/i18n";
import { createService, updateService, deleteService } from "./actions";

export function ServiceList({ services }: { services: Service[] }) {
  const t = useTranslations("homepage.services");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createService(name.trim(), description);
      setCreateOpen(false);
      setName("");
      setDescription(undefined);
    } catch {
      toast(t("createError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingService || !name.trim()) return;
    setLoading(true);
    try {
      await updateService(editingService.serviceId, name.trim(), description);
      setEditingService(null);
      setName("");
      setDescription(undefined);
    } catch {
      toast(t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    setLoading(true);
    try {
      await deleteService(serviceId);
    } catch {
      toast(t("deleteError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-md">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      {services.map((service) => {
        const isDefault = service.serviceId.startsWith("service_default");
        return (
          <div
            key={service.serviceId}
            className="flex items-center justify-between rounded-lg border px-3 py-1.5"
          >
            <div className="flex flex-col">
              <p className="font-medium">{service.name}</p>
              {isDefault && (
                <p className="text-xs text-muted-foreground">
                  {t("defaultServiceHint")}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingService(service);
                  setName(service.name);
                  setDescription(service.description);
                }}
              >
                <Pencil className="size-4" />
              </Button>
              {!isDefault && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(service.serviceId)}
                  disabled={loading}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}

      <Button
        variant="outline"
        onClick={() => {
          setCreateOpen(true);
          setName("");
          setDescription(undefined);
        }}
      >
        <Plus className="size-4 mr-2" />
        {t("addService")}
      </Button>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
            <DialogDescription>{t("createDescription")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="service-name">{t("name")}</Label>
              <Input
                id="service-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
              />
            </div>
            {description !== undefined ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>{t("description")}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => setDescription(undefined)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
                <Tiptap
                  content={description}
                  onUpdate={(html) => setDescription(html)}
                  className="w-full h-fit min-h-[60px] prose prose-sm"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDescription("")}
              >
                <FileText className="size-4 mr-2" />
                {t("addDescription")}
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={loading || !name.trim()}>
              {loading ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingService}
        onOpenChange={(open) => {
          if (!open) {
            setEditingService(null);
            setDescription(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription>{t("editDescription")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-service-name">{t("name")}</Label>
              <Input
                id="edit-service-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {description !== undefined ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>{t("description")}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => setDescription(undefined)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
                <Tiptap
                  content={description}
                  onUpdate={(html) => setDescription(html)}
                  className="w-full h-fit min-h-[60px] prose prose-sm"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDescription("")}
              >
                <FileText className="size-4 mr-2" />
                {t("addDescription")}
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={loading || !name.trim()}>
              {loading ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
