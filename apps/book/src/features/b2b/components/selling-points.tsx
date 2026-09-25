import { getB2bTranslations } from "../pricing";
import { Section, SectionTitle } from "./section";

export async function SellingPoints({
  locale,
  occupations,
  services,
}: {
  locale: string;
  // Plural occupation label, e.g. "barbers"
  occupations: string;
  // Example service names, e.g. "Haircut, Beard trim"
  services: string | null;
}) {
  const t = await getB2bTranslations(locale, "b2b.selling");

  const points = [
    { title: t("simpleTitle"), text: t("simpleText") },
    { title: t("priceTitle"), text: t("priceText") },
    {
      title: t("servicesTitle"),
      text: services
        ? t("servicesText", { services })
        : t("servicesFallback"),
    },
  ];

  return (
    <Section>
      <SectionTitle>{t("title", { occupations })}</SectionTitle>
      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        {points.map((point) => (
          <div
            key={point.title}
            className="flex flex-col gap-2 rounded-md border border-accent bg-accent/50 p-6 lg:p-7"
          >
            <h3 className="m-0 text-xl font-bold leading-7 lg:text-[22px]">
              {point.title}
            </h3>
            <p className="m-0 leading-6 text-muted-foreground">{point.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
