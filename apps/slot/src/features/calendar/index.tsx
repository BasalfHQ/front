import { getSession } from "@repo/auth-ui";
import { getLocale, redirect, getTranslations } from "@repo/i18n";
import { baseUrl } from "@repo/config";
import { CalendarSubscriptionClient } from "./calendar-client";

const isProd = process.env.NEXT_PUBLIC_STAGE === "prod";
const slotBaseUrl = isProd
  ? baseUrl.replace("//", "//slot.")
  : "http://localhost:3003";

export async function CalendarSubscription() {
  const [session, locale, t] = await Promise.all([
    getSession(),
    getLocale(),
    getTranslations("calendar"),
  ]);

  if (!session?.idToken || !session.user?.currentOrganization) {
    return redirect({ href: "/", locale });
  }

  const orgId = session.user.currentOrganization;
  const subscriptionUrl = `${slotBaseUrl.replace(/\/$/, "")}/api/calendar/${orgId}`;

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>
      <CalendarSubscriptionClient url={subscriptionUrl} />
    </div>
  );
}
