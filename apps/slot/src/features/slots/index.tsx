import { getSession } from "@repo/auth-ui";
import { getTranslations, redirect } from "@repo/i18n";
import { PageDescription, PageTitle } from "@repo/ui";
import { SlotCalendar } from "./components/calendar";
import { QueryProvider } from "@repo/ui";
import { getSlots } from "./actions";
import { Slot } from "@repo/apis";
import { addWeeks } from "date-fns";
import { buildServiceColorMap } from "./service-colors";

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
  const [initialSlots, services] = await Promise.all([
    getSlots(now.toISOString(), addWeeks(now, 1).toISOString()),
    Slot.getServices(session.idToken),
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
