"use client";

import { PageSeo } from "@repo/apis";
import { useTranslations } from "@repo/i18n";
import { CardInput, TagInput } from "@repo/ui";
import { AddNewSchema } from "./components/add-schema";
import { SchemaItem } from "./components/schema-item";
import type { SchemaErrors } from "@/features/create-page/components/form";

export function SeoForm({
  value,
  onChange,
  errors,
  schemaErrors,
}: {
  value: PageSeo;
  onChange: (seo: PageSeo) => void;
  errors?: { title?: string; description?: string };
  schemaErrors?: (SchemaErrors | null)[];
}) {
  const t = useTranslations("SeoForm");

  const seo: PageSeo = {
    title: value.title ?? "",
    description: value.description ?? "",
    keywords: value.keywords ?? [],
    schemas: value.schemas ?? [],
  };

  function updateSchema(index: number, schema: PageSeo["schemas"][number]) {
    const updated = [...seo.schemas];
    updated[index] = schema;
    onChange({ ...seo, schemas: updated });
  }

  function deleteSchema(index: number) {
    onChange({ ...seo, schemas: seo.schemas.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-col gap-2">
        <div className="text-xl font-medium">{t("title")}</div>
        <div className="text-sm text-muted-foreground">{t("description")}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <CardInput
          type="input"
          label={t("fields.title")}
          description={t("fields.titleDescription")}
          value={seo.title}
          onChange={(v) => onChange({ ...seo, title: v })}
          placeholder={t("fields.titlePlaceholder")}
          className="min-w-[300px] bg-accent/20 flex-1"
          required
          error={errors?.title}
        />
        <CardInput
          type="input"
          label={t("fields.description")}
          description={t("fields.descriptionDescription")}
          value={seo.description}
          onChange={(v) => onChange({ ...seo, description: v })}
          placeholder={t("fields.descriptionPlaceholder")}
          className="min-w-[300px] bg-accent/20 flex-1"
          required
          error={errors?.description}
        />
        <div className="flex flex-col gap-1 rounded-md border p-4 min-w-[300px] bg-accent/20 flex-1">
          <p className="text-sm font-medium">{t("fields.keywords")}</p>
          <p className="text-sm text-muted-foreground">
            {t("fields.keywordsDescription")}
          </p>
          <TagInput
            value={seo.keywords ?? []}
            onChange={(keywords) => onChange({ ...seo, keywords })}
            placeholder={t("fields.keywordsPlaceholder")}
            className="max-w-[300px]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full mt-4">
        <div className="text-lg font-medium">{t("schemas.title")}</div>
        <div className="text-sm text-muted-foreground">
          {t("schemas.description")}
        </div>

        <div className="flex flex-col gap-2 w-full">
          {seo.schemas.map((schema, index) => (
            <SchemaItem
              key={index}
              schema={schema}
              onChange={(s) => updateSchema(index, s)}
              onDelete={() => deleteSchema(index)}
              errors={schemaErrors?.[index] ?? undefined}
            />
          ))}
        </div>

        <AddNewSchema
          existingTypes={seo.schemas.map((s) => s.type)}
          onAdd={(schema) =>
            onChange({ ...seo, schemas: [...seo.schemas, schema] })
          }
        />
      </div>
    </div>
  );
}
