import { useTranslations } from "@repo/i18n";
import { cn } from "@repo/ui/lib/utils";

export function BlockLevel({
  level,
  onChange,
}: {
  level: 2 | 3 | undefined;
  onChange: (level: 2 | 3 | undefined) => void;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md">{t("attributes.level")}</p>
      <div className="flex gap-2">
        <p
          className={cn(
            "border rounded-md p-1 w-[100px] flex items-center justify-center text-sm cursor-pointer",
            level === 3 && "bg-accent",
          )}
          onClick={() => onChange(level === 3 ? undefined : 3)}
        >
          {t("attributes.small")}
        </p>
        <p
          className={cn(
            "border rounded-md p-1 w-[100px] flex items-center justify-center text-md cursor-pointer",
            level === 2 && "bg-accent",
          )}
          onClick={() => onChange(level === 2 ? undefined : 2)}
        >
          {t("attributes.medium")}
        </p>
      </div>
    </div>
  );
}
