import { useTranslations } from "next-intl";

export function SlotEvent({
  arg,
}: {
  arg: { timeText: string; event: { extendedProps: Record<string, unknown> } };
  }) {
  const t = useTranslations("slots.SlotEvent");
  const usedCapacity = arg.event.extendedProps.usedCapacity as number;
  const maxCapacity = arg.event.extendedProps.maxCapacity as number;
  const isFull = usedCapacity >= maxCapacity;

  return (
    <div className="flex flex-col gap-0.5 p-1 h-full overflow-hidden bg-accent/20">
      <span className="text-[0.7rem] opacity-80">{arg.timeText}</span>
      {maxCapacity > 1 && (
        <div className="flex items-center gap-1">
          <span
            className={`text-xs font-semibold ${isFull ? "text-destructive-foreground" : ""}`}
          >
            {maxCapacity - usedCapacity}/{maxCapacity} {t("slotsAvailable")}
          </span>
        </div>
      )}
      <div className="mt-auto w-full bg-primary-foreground/20 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all ${isFull ? "bg-destructive" : "bg-primary-foreground/80"}`}
          style={{
            width: `${Math.min(100, (usedCapacity / maxCapacity) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
