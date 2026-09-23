import { getSession } from "@repo/auth-ui";
import { getTranslations, redirect } from "@repo/i18n";
import { PageDescription, PageTitle, Card, CardHeader } from "@repo/ui";
import { CalendarPlus } from "@repo/ui/icons";
import { SlotCalendar } from "./components/calendar";
import { QueryProvider } from "@repo/ui";
import { getSlots } from "./actions";
import { Slot } from "@repo/apis";
import { addWeeks } from "date-fns";
import { buildServiceColorMap } from "./service-colors";
import { hasUpcomingSlots } from "./has-upcoming-slots";

export default async function Slots({
  params,
}: {
  params: { locale: string };
}) {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations("slots"),
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale: params.locale });
  }

  const now = new Date();
  const [initialSlots, services, noSlotsYet] = await Promise.all([
    getSlots(now.toISOString(), addWeeks(now, 1).toISOString()),
    Slot.getServices(session.idToken),
    hasUpcomingSlots(session.idToken).then((has) => !has),
  ]);

  const serviceColorMap = buildServiceColorMap(
    services.map((s) => s.serviceId),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      {noSlotsYet && (
        <Card variant="warning" className="w-full max-w-md flex-row items-center gap-3">
          <CalendarPlus className="h-5 w-5 shrink-0 text-warning" />
          <CardHeader className="gap-0">
            <p className="text-sm font-medium">{t("noSlotsYetTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("noSlotsYetDescription")}</p>
          </CardHeader>
        </Card>
      )}
      <QueryProvider>
        <SlotCalendar
          initialSlots={initialSlots}
          services={services}
          serviceColorMap={serviceColorMap}
        />
      </QueryProvider>
    </div>
  );
}
