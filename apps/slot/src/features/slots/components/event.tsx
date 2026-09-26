import { Badge } from "@repo/ui";
import { useTranslations } from "next-intl";

export function SlotEvent({
  arg,
  isMobile,
}: {
  arg: {
    timeText: string;
    event: {
      start: Date | null;
      end: Date | null;
      extendedProps: Record<string, unknown>;
    };
  };
  isMobile?: boolean;
}) {
  const t = useTranslations("slots.SlotEvent");
  const usedCapacity = arg.event.extendedProps.usedCapacity as number;
  const maxCapacity = arg.event.extendedProps.maxCapacity as number;
  const color = arg.event.extendedProps.color as string | undefined;
  const isFull = usedCapacity >= maxCapacity;
  const { start, end } = arg.event;
  const durationMs =
    start && end ? end.getTime() - start.getTime() : Infinity;
  const isShort = durationMs <= 45 * 60 * 1000;
  if (isShort) {
    return (
      <div
        className="slot-event-short flex items-center gap-1 h-full overflow-hidden text-primary"
        style={{ backgroundColor: color }}
      >
        {isFull && (
          <Badge
            variant="success"
            className="h-full max-h-5 justify-center shrink-0"
          >
            {t("full")}
          </Badge>
        )}
        <span className="slot-event-short-time text-[0.7rem] opacity-80 truncate">
          {arg.timeText}
        </span>
      </div>
    );
  }

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
        {isFull && (
          <Badge variant="success">
            {t("full")}
          </Badge>
        )}
      </div>
    </div>
  );
}
