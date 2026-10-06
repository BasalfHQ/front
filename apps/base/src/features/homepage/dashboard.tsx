import type { auth } from "@repo/auth-ui";
import { Base, Slot } from "@repo/apis";
import { appUrl } from "@repo/config";
import { getLocale, getTranslations, Link } from "@repo/i18n";
import { Button, Card, CardHeader, PageDescription, PageTitle, formatDate } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { CircleCheck, CircleDashed, ExternalLink } from "@repo/ui/icons";
import { getSubscription } from "@/features/billing/actions";
import { isUsableSubscription } from "@/features/billing/needs-subscription";
import { Section } from "./section";

type Session = NonNullable<Awaited<ReturnType<typeof auth>>>;

const APPS = ["slot", "cms"] as const;

function bookingPageUrl(organizationId: string, locale: string): string {
  // Book uses localePrefix "as-needed": no prefix for the default "en".
  const localePath = locale === "en" ? "" : `${locale}/`;
  return `${appUrl("book")}${localePath}service-provider/${organizationId}`;
}

// The book app 404s an org page until it's set up, so only link to one that resolves.
async function pageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function Dashboard({ session }: { session: Session }) {
  const idToken = session.idToken!;

  const [t, locale, organizations, slotCount, subscription] = await Promise.all([
    getTranslations("homepage"),
    getLocale(),
    Base.getOrganizationsByEmail(idToken),
    Slot.getUpcomingSlotCount(idToken),
    getSubscription(),
  ]);

  const organization =
    organizations.find((org) => org.organizationId === session.user.currentOrganization) ??
    organizations[0];
  const firstName = session.user.name?.trim().split(/\s+/)[0];

  const bookingUrl = organization && bookingPageUrl(organization.organizationId, locale);
  const showBookingPage = !!bookingUrl && (await pageExists(bookingUrl));

  const billingSummary = isUsableSubscription(subscription)
    ? t(subscription.cancelAtPeriodEnd ? "dashboard.endsOn" : "dashboard.renewsOn", {
        plan: subscription.planId,
        date: formatDate(subscription.currentPeriodEnd, locale),
      })
    : t("dashboard.noPlan");

  const accountLinks = [
    { href: "/users", label: t("dashboard.users") },
    { href: "/settings", label: t("dashboard.settings") },
    // Billing lives in settings (see app/(app)/billing/page.tsx).
    { href: "/settings", label: t("dashboard.billing"), detail: billingSummary },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>
          {firstName ? t("dashboard.title", { firstName }) : t("dashboard.titleNoName")}
        </PageTitle>
        {organization && (
          <PageDescription>
            {t("dashboard.description", { orgName: organization.name })}
          </PageDescription>
        )}
      </div>

      {organization && slotCount === 0 && (
        <Card variant="warning" className="w-full max-w-4xl gap-3 sm:flex-row sm:items-center">
          <CardHeader>
            <p className="font-medium">{t("dashboard.setupTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("dashboard.setupDescription")}</p>
          </CardHeader>
          <Button asChild className="shrink-0">
            <a href={appUrl("slot")}>{t("dashboard.setupAction")}</a>
          </Button>
        </Card>
      )}

      <Section title={t("dashboard.appsTitle")}>
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {APPS.map((app) => (
            <Card key={app} className="w-full justify-start" href={appUrl(app)}>
              <CardHeader>
                <p className="font-medium">{t(`${app}.title`)}</p>
                <p className="text-sm text-muted-foreground">{t(`${app}.description`)}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
        {showBookingPage && organization && (
          <Card
            href={bookingUrl}
            variant={organization.isOnBookWebsite ? "success" : "default"}
            // Card's default href hover is accent; stay green on the live card.
            className={cn(
              "w-full max-w-4xl flex-row items-center justify-start gap-3",
              organization.isOnBookWebsite && "hover:bg-success/25",
            )}
          >
            {organization.isOnBookWebsite ? (
              <CircleCheck className="h-5 w-5 shrink-0 text-success" />
            ) : (
              <CircleDashed className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex flex-1 flex-col gap-1">
              <p className="font-medium">{t("dashboard.bookPage")}</p>
              <p className="text-sm text-muted-foreground">
                {organization.isOnBookWebsite
                  ? t("dashboard.bookPageLive")
                  : t("dashboard.bookPageNotLive")}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Card>
        )}
      </Section>

      <Section title={t("dashboard.accountTitle")}>
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {accountLinks.map(({ href, label, detail }) => (
            <Link key={label} href={href}>
              <Card className="h-full w-full justify-start hover:bg-accent/80">
                <p className="font-medium">{label}</p>
                {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
