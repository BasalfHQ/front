"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@repo/ui";
import { X } from "@repo/ui/icons";
import type { BookingCategory } from "./actions";

interface OccupationSelectProps {
  categories: BookingCategory[];
  locale: string;
  value?: string;
  onChange: (occupationId: string | null, occupationLabel: string) => void;
}

export function OccupationSelect({
  categories,
  locale,
  value,
  onChange,
}: OccupationSelectProps) {
  const [categoryId, setCategoryId] = useState<string>(() => {
    if (!value) return "";
    for (const cat of categories) {
      if (cat.occupations.some((o) => o.id === value)) return cat.id;
    }
    return "";
  });

  const [occupationId, setOccupationId] = useState<string>(value || "");

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        (a.labels[locale] || a.labels["en"] || "").localeCompare(
          b.labels[locale] || b.labels["en"] || "",
          locale
        )
      ),
    [categories, locale]
  );

  const selectedCategory = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return null;
    return {
      ...cat,
      occupations: [...cat.occupations].sort((a, b) =>
        (a.labels[locale] || a.labels["en"] || "").localeCompare(
          b.labels[locale] || b.labels["en"] || "",
          locale
        )
      ),
    };
  }, [categories, categoryId, locale]);

  const label = useCallback(
    (labels: Record<string, string>) => {
      const raw = labels[locale] || labels["en"] || "";
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    },
    [locale]
  );

  const handleCategoryChange = useCallback(
    (id: string) => {
      setCategoryId(id);
      setOccupationId("");
      onChange(null, "");
    },
    [onChange]
  );

  const handleOccupationChange = useCallback(
    (id: string) => {
      setOccupationId(id);
      const occ = selectedCategory?.occupations.find((o) => o.id === id);
      if (occ) {
        onChange(id, label(occ.labels));
      }
    },
    [selectedCategory, onChange, label]
  );

  const handleClear = useCallback(() => {
    setCategoryId("");
    setOccupationId("");
    onChange(null, "");
  }, [onChange]);

  return (
    <div className="flex flex-col gap-2">
      <Select value={categoryId} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category..." />
        </SelectTrigger>
        <SelectContent className="max-w-80">
          {sortedCategories.map((cat) => (
            <SelectItem
              key={cat.id}
              value={cat.id}
              className="whitespace-normal leading-snug py-2"
            >
              {label(cat.labels)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCategory && (
        <Select value={occupationId} onValueChange={handleOccupationChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an occupation..." />
          </SelectTrigger>
          <SelectContent className="max-w-80">
            {selectedCategory.occupations.map((occ) => (
              <SelectItem
                key={occ.id}
                value={occ.id}
                className="whitespace-normal leading-snug py-2"
              >
                {label(occ.labels)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {categoryId && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={handleClear}
        >
          <X className="size-3 mr-1" />
          Clear selection
        </Button>
      )}
    </div>
  );
}
