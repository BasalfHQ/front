"use client";

import { Slot } from "@repo/apis";
import { Button, Checkbox } from "@repo/ui";
import type { ServiceColorMap } from "../service-colors";
import { useTranslations } from "@repo/i18n";

export function ServiceFilter({
  services,
  serviceColorMap,
  selectedIds,
  onSelectionChange,
}: {
  services: Slot.Service[];
  serviceColorMap: ServiceColorMap;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}) {
  const t = useTranslations("slots");
  const allSelected = selectedIds.size === services.length;

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(services.map((s) => s.serviceId)));
    }
  }

  function toggle(serviceId: string) {
    const next = new Set(selectedIds);
    if (next.has(serviceId)) {
      next.delete(serviceId);
    } else {
      next.add(serviceId);
    }
    onSelectionChange(next);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={toggleAll}>
        {allSelected ? t("unselectAll") : t("selectAll")}
      </Button>
      {services.map((service) => (
        <button
          key={service.serviceId}
          onClick={() => toggle(service.serviceId)}
          className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm transition-opacity"
          style={{
            opacity: selectedIds.has(service.serviceId) ? 1 : 0.4,
          }}
        >
          <span
            className="size-3 rounded-sm shrink-0"
            style={{ backgroundColor: serviceColorMap[service.serviceId] }}
          />
          <Checkbox
            checked={selectedIds.has(service.serviceId)}
            onCheckedChange={() => toggle(service.serviceId)}
            className="size-3.5"
          />
          <span>{service.name}</span>
        </button>
      ))}
    </div>
  );
}
