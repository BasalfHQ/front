"use client";

import { useState, useCallback } from "react";
import { Service } from "@repo/apis";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  toast,
} from "@repo/ui";
import { Plus, Pencil, Trash2 } from "@repo/ui/icons";
import {
  createService,
  updateService,
  deleteService,
  getBookingOccupations,
  type BookingCategory,
} from "./actions";
import { OccupationSelect } from "./occupation-select";

export function ServiceList({
  services,
  locale,
}: {
  services: Service[];
  locale: string;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BookingCategory[] | null>(null);

  const loadEscoData = useCallback(async () => {
    if (categories) return;
    const data = await getBookingOccupations();
    setCategories(data.categories);
  }, [categories]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createService(name.trim());
      setCreateOpen(false);
      setName("");
    } catch {
      toast("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingService || !name.trim()) return;
    setLoading(true);
    try {
      await updateService(editingService.serviceId, name.trim());
      setEditingService(null);
      setName("");
    } catch {
      toast("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    setLoading(true);
    try {
      await deleteService(serviceId);
    } catch {
      toast("Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-md">
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
                  Default service — rename it but cannot be deleted
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
                  loadEscoData();
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
          loadEscoData();
        }}
      >
        <Plus className="size-4 mr-2" />
        Add a service
      </Button>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a service</DialogTitle>
            <DialogDescription>
              A service represents an activity or offering provided by your
              organization.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label>Occupation</Label>
            {categories ? (
              <OccupationSelect
                categories={categories}
                locale={locale}
                onChange={(_id, label) => setName(label)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingService}
        onOpenChange={(open) => {
          if (!open) setEditingService(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>Update the service name.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label>Occupation</Label>
            {categories ? (
              <OccupationSelect
                categories={categories}
                locale={locale}
                onChange={(_id, label) => setName(label)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={loading || !name.trim()}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
