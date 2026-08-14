import { PageSeo } from "@repo/apis";
import { useTranslations } from "@repo/i18n";
import {
  Input,
  DatePicker,
  TagInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Trash2 } from "@repo/ui/icons";
import type { SchemaErrors } from "@/features/create-page/components/form";

type Schema = PageSeo["schemas"][number];

export function SchemaItem({
  schema,
  onChange,
  onDelete,
  errors,
}: {
  schema: Schema;
  onChange: (schema: Schema) => void;
  onDelete: () => void;
  errors?: SchemaErrors;
}) {
  const t = useTranslations("SeoForm");

  const hasErrors = errors && Object.keys(errors).length > 0;

  return (
    <div
      className={`flex gap-2 border rounded-md p-4 bg-accent/20 w-full ${hasErrors ? "border-destructive" : ""}`}
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full flex gap-3 items-center justify-end text-sm text-muted-foreground">
          {t(`schemas.types.${schema.type}.name`)}
          <Trash2
            className="size-6 cursor-pointer text-destructive hover:text-destructive/80"
            onClick={onDelete}
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          {schema.type === "article" && (
            <ArticleFields
              schema={schema}
              onChange={(s) => onChange(s)}
              errors={errors}
            />
          )}
          {schema.type === "person" && (
            <PersonFields
              schema={schema}
              onChange={(s) => onChange(s)}
              errors={errors}
            />
          )}
          {schema.type === "product" && (
            <ProductFields
              schema={schema}
              onChange={(s) => onChange(s)}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type ArticleSchema = Extract<Schema, { type: "article" }>;
type PersonSchema = Extract<Schema, { type: "person" }>;
type ProductSchema = Extract<Schema, { type: "product" }>;

function ArticleFields({
  schema,
  onChange,
  errors,
}: {
  schema: ArticleSchema;
  onChange: (schema: ArticleSchema) => void;
  errors?: SchemaErrors;
}) {
  const t = useTranslations("SeoForm.schemas.types.article");

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.title")}</label>
          <Input
            value={schema.title}
            onChange={(e) => onChange({ ...schema, title: e.target.value })}
            className={errors?.title ? "border-destructive" : ""}
            placeholder={t("fields.titlePlaceholder")}
          />
          {errors?.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.description")}</label>
          <Input
            value={schema.description}
            onChange={(e) => onChange({ ...schema, description: e.target.value })}
            className={errors?.description ? "border-destructive" : ""}
            placeholder={t("fields.descriptionPlaceholder")}
          />
          {errors?.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.date")}</label>
          <DatePicker
            value={schema.date}
            onChange={(date) => onChange({ ...schema, date })}
            placeholder={t("fields.datePlaceholder")}
            error={errors?.date}
            className="w-[300px]"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.readingTime")}</label>
          <Input
            type="number"
            value={schema.readingTime}
            onChange={(e) =>
              onChange({ ...schema, readingTime: Number(e.target.value) })
            }
            className={errors?.readingTime ? "border-destructive" : ""}
            placeholder={t("fields.readingTimePlaceholder")}
          />
          {errors?.readingTime && <p className="text-xs text-destructive">{errors.readingTime}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{t("fields.keywords")}</label>
        <TagInput
          value={schema.keywords}
          onChange={(keywords) => onChange({ ...schema, keywords })}
          placeholder={t("fields.keywordsPlaceholder")}
          error={errors?.keywords}
        />
      </div>
    </>
  );
}

function PersonFields({
  schema,
  onChange,
  errors,
}: {
  schema: PersonSchema;
  onChange: (schema: PersonSchema) => void;
  errors?: SchemaErrors;
}) {
  const t = useTranslations("SeoForm.schemas.types.person");

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.name")}</label>
          <Input
            value={schema.name}
            onChange={(e) => onChange({ ...schema, name: e.target.value })}
            className={errors?.name ? "border-destructive" : ""}
            placeholder={t("fields.namePlaceholder")}
          />
          {errors?.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.jobTitle")}</label>
          <Input
            value={schema.jobTitle ?? ""}
            onChange={(e) => onChange({ ...schema, jobTitle: e.target.value })}
            placeholder={t("fields.jobTitlePlaceholder")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{t("fields.description")}</label>
        <Input
          value={schema.description ?? ""}
          onChange={(e) => onChange({ ...schema, description: e.target.value })}
          placeholder={t("fields.descriptionPlaceholder")}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.url")}</label>
          <Input
            value={schema.url ?? ""}
            onChange={(e) => onChange({ ...schema, url: e.target.value })}
            placeholder="https://"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.sameAs")}</label>
          <Input
            value={(schema.sameAs ?? []).join(", ")}
            onChange={(e) =>
              onChange({
                ...schema,
                sameAs: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder={t("fields.sameAsPlaceholder")}
          />
        </div>
      </div>
    </>
  );
}

function ProductFields({
  schema,
  onChange,
  errors,
}: {
  schema: ProductSchema;
  onChange: (schema: ProductSchema) => void;
  errors?: SchemaErrors;
}) {
  const t = useTranslations("SeoForm.schemas.types.product");

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.name")}</label>
          <Input
            value={schema.name}
            onChange={(e) => onChange({ ...schema, name: e.target.value })}
            className={errors?.name ? "border-destructive" : ""}
            placeholder={t("fields.namePlaceholder")}
          />
          {errors?.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">{t("fields.brand")}</label>
          <Input
            value={schema.brand ?? ""}
            onChange={(e) => onChange({ ...schema, brand: e.target.value })}
            placeholder={t("fields.brandPlaceholder")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{t("fields.description")}</label>
        <Input
          value={schema.description ?? ""}
          onChange={(e) => onChange({ ...schema, description: e.target.value })}
          placeholder={t("fields.descriptionPlaceholder")}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
          <label className="text-sm font-medium">{t("fields.price")}</label>
          <Input
            type="number"
            value={schema.price ?? ""}
            onChange={(e) =>
              onChange({
                ...schema,
                price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder={t("fields.pricePlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
          <label className="text-sm font-medium">{t("fields.currency")}</label>
          <Input
            value={schema.priceCurrency ?? ""}
            onChange={(e) =>
              onChange({ ...schema, priceCurrency: e.target.value })
            }
            placeholder="USD, EUR..."
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
          <label className="text-sm font-medium">{t("fields.availability")}</label>
          <Select
            value={schema.availability ?? ""}
            onValueChange={(v) =>
              onChange({
                ...schema,
                availability: (v || undefined) as
                  | "InStock"
                  | "OutOfStock"
                  | "PreOrder"
                  | undefined,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("fields.selectAvailability")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="InStock">{t("fields.inStock")}</SelectItem>
              <SelectItem value="OutOfStock">{t("fields.outOfStock")}</SelectItem>
              <SelectItem value="PreOrder">{t("fields.preOrder")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
