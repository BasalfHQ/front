import { Badge } from "@repo/ui";
import { useTranslations } from "next-intl";

export function SlotEvent({
  arg,
}: {
  arg: { timeText: string; event: { extendedProps: Record<string, unknown> } };
}) {
  const t = useTranslations("slots.SlotEvent");
  const usedCapacity = arg.event.extendedProps.usedCapacity as number;
  const maxCapacity = arg.event.extendedProps.maxCapacity as number;
  const color = arg.event.extendedProps.color as string | undefined;
  const isFull = usedCapacity >= maxCapacity;

  return (
    <div
      className="flex flex-col justify-between p-1 h-full overflow-hidden text-primary"
      style={{ backgroundColor: color }}
    >
      <span className="text-[0.7rem] opacity-80">{arg.timeText}</span>
      <div>
        {maxCapacity > 1 && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-semibold ${isFull ? "text-destructive-foreground" : "text-primary"}`}
            >
              {usedCapacity}/{maxCapacity} {t("slotsUsed")}
            </span>
          </div>
        )}
        <Badge variant={isFull ? "success" : "default"}>
          {isFull ? t("full") : t("available")}
        </Badge>
      </div>
    </div>
  );
}
