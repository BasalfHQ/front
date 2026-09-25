import { getB2bTranslations } from "../pricing";
import type { ExampleService } from "../content";
import { Section, SectionTitle } from "./section";

// Example services of the occupation, as a real table (readable by search
// engines and screen readers, unlike the phone mockup).
export async function ServicesTable({
  locale,
  occupations,
  services,
}: {
  locale: string;
  occupations: string;
  services: ExampleService[];
}) {
  if (services.length === 0) return null;
  const t = await getB2bTranslations(locale, "b2b.services");

  return (
    <Section className="gap-4 lg:gap-5">
      <SectionTitle>{t("title", { occupations })}</SectionTitle>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left">
          <thead className="bg-muted text-sm text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium lg:px-5">
                {t("name")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium lg:px-5">
                {t("duration")}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium lg:px-5">
                {t("price")}
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.name}
                className="border-t border-border"
              >
                <th scope="row" className="px-4 py-3 font-semibold lg:px-5">
                  {service.name}
                </th>
                <td className="px-4 py-3 text-muted-foreground lg:px-5">
                  {service.duration}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right lg:px-5">
                  {service.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 text-sm text-muted-foreground">{t("note")}</p>
    </Section>
  );
}
