import { useTranslations } from "@repo/i18n";
import { Switch, Label, Input } from "@repo/ui";

export function BlockList({
  list,
  onChange,
  error,
}: {
  list: {
    ordered?: boolean | undefined;
    items: {
      text: string;
    }[];
  };
  onChange: (list: {
    ordered?: boolean | undefined;
    items: {
      text: string;
    }[];
  }) => void;
  error?: string;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md">{t("attributes.list")}</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2 items-center">
        <Switch
          checked={list.ordered}
          onCheckedChange={(checked) => onChange({ ...list, ordered: checked })}
        />
        <Label
          onClick={() => onChange({ ...list, ordered: !list.ordered })}
          className="cursor-pointer"
        >
          {t("attributes.ordered")}
        </Label>
      </div>
      <div className="flex flex-col c">
        {list.items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <p className="text-sm w-[20px] text-center">
              {list.ordered ? `${index + 1}.` : "•"}
            </p>
            <Input
              value={item.text}
              id={`list-item-${index}`}
              onChange={(e) =>
                onChange({
                  ...list,
                  items: list.items.map((item, i) =>
                    i === index ? { ...item, text: e.target.value } : item,
                  ),
                })
              }
              className="border-none shadow-none p-0 focus-visible:ring-none focus-visible:border-none"
              onKeyDown={(e) => {
                if (
                  (e.key === "Delete" || e.key === "Backspace") &&
                  item.text.length == 0
                ) {
                  onChange({
                    ...list,
                    items: list.items.filter((item, i) => i !== index),
                  });
                } else if (e.key === "Enter") {
                  onChange({
                    ...list,
                    items: [...list.items, { text: "" }],
                  });
                  document.getElementById(`list-item-${index + 1}`)?.focus();
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
