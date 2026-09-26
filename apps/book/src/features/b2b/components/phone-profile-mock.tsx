import Image from "next/image";
import { getB2bTranslations } from "../pricing";
import type { ExampleService } from "../content";

// Phone mockup of a Book profile page (/service-provider/[orgId]) filled with
// the occupation's example services. Decorative: the label describes it.
export async function PhoneProfileMock({
  locale,
  occupation,
  services,
}: {
  locale: string;
  occupation: string;
  services: ExampleService[];
}) {
  const t = await getB2bTranslations(locale, "b2b.mock");

  return (
    <div className="h-[616px] w-[300px] shrink-0 rounded-[44px] bg-foreground p-2 shadow-[0_24px_48px_-24px_hsl(var(--foreground)/0.45)]">
      <div
        role="img"
        aria-label={t("label")}
        className="relative h-[600px] w-[284px] overflow-hidden rounded-[36px] bg-card"
      >
        <div
          aria-hidden
          className="pointer-events-none w-[360px] origin-top-left scale-[0.78889] select-none"
        >
          <div className="flex min-h-[760px] flex-col items-center gap-10 bg-background px-5 pb-24 pt-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-60 w-48 overflow-hidden rounded-lg">
                <Image
                  src="/b2b/lina-moreau.png"
                  alt={t("photo")}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em]">
                  {t("name")}
                </p>
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {occupation}
                </p>
              </div>
            </div>

            <div className="grid w-full gap-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{service.name}</span>
                    <ServicePill service={service} />
                  </div>
                  <span className="flex min-h-11 w-fit items-center justify-center rounded-md bg-info px-6 text-sm font-semibold text-info-foreground">
                    {t("book")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicePill({ service }: { service: ExampleService }) {
  const label = [service.duration, service.price].filter(Boolean).join(" · ");
  if (!label) return null;
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
      {label}
    </span>
  );
}
