import { useTranslations } from "@repo/i18n";
import { Input } from "@repo/ui";

export function BlockRelated({
  related,
  onChange,
  error,
}: {
  related: string[];
  onChange: (related: string[]) => void;
  error?: string;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md">{t("attributes.related.title")}</p>
      <p className="text-sm text-muted-foreground">
        {t("attributes.related.description")}
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex flex-col gap-2">
        {related.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={item}
              id={`related-item-${index}`}
              onChange={(e) =>
                onChange(
                  related.map((item, i) =>
                    i === index ? e.target.value : item,
                  ),
                )
              }
              className="border-muted-foreground shadow-none"
              onKeyDown={(e) => {
                if (
                  (e.key === "Delete" || e.key === "Backspace") &&
                  item.length == 0 &&
                  related.length > 1
                ) {
                  onChange(related.filter((_, i) => i !== index));
                } else if (e.key === "Enter") {
                  onChange([...related, ""]);
                  document.getElementById(`related-item-${index + 1}`)?.focus();
                }
              }}
              placeholder={t("attributes.related.placeholder")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
