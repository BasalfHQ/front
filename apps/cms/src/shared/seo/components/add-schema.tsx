import { PageSeo } from "@repo/apis";
import { useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui";
import { useState } from "react";

type Schema = PageSeo["schemas"][number];
type SchemaType = Schema["type"];

const schemaTypes: SchemaType[] = ["article", "person", "product"];

const baseSchemas: Record<SchemaType, Schema> = {
  article: {
    type: "article",
    title: "",
    description: "",
    date: "",
    readingTime: 0,
    keywords: [],
  },
  person: {
    type: "person",
    name: "",
  },
  product: {
    type: "product",
    name: "",
  },
};

export function AddNewSchema({
  onAdd,
  existingTypes,
}: {
  onAdd: (schema: Schema) => void;
  existingTypes: SchemaType[];
}) {
  const [openSelection, setOpenSelection] = useState(false);
  const t = useTranslations("SeoForm");
  const availableTypes = schemaTypes.filter(
    (type) => !existingTypes.includes(type),
  );

  if (availableTypes.length === 0) return null;

  if (!openSelection) {
    return (
      <Button
        variant="outline"
        className="border bg-transparent shadow-none w-full max-w-[500px] self-center"
        onClick={() => setOpenSelection(true)}
      >
        {t("schemas.add")}
      </Button>
    );
  }

  function handleAdd(type: SchemaType) {
    onAdd(baseSchemas[type]);
    setOpenSelection(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <p
        onClick={() => setOpenSelection(false)}
        className="text-gray-500 hover:text-gray-700 cursor-pointer underline text-md"
      >
        {t("schemas.cancel")}
      </p>
      <div className="flex flex-wrap gap-2">
        {availableTypes.map((type) => (
          <div
            key={type}
            className="border bg-transparent shadow-none w-full min-w-[200px] flex-1 flex flex-col p-2 items-center justify-center cursor-pointer bg-accent/20 hover:bg-accent/60"
            onClick={() => handleAdd(type)}
          >
            <p>{t(`schemas.types.${type}.name`)}</p>
            <p className="text-sm text-muted-foreground">
              {t(`schemas.types.${type}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
