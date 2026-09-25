import { getB2bTranslations } from "../pricing";
import { Section, SectionTitle } from "./section";

export async function HowItWorks({
  locale,
  services,
}: {
  locale: string;
  // Example service names, e.g. "Haircut, Beard trim, Hot towel shave"
  services: string | null;
}) {
  const t = await getB2bTranslations(locale, "b2b.how");

  const steps = [
    { title: t("s1Title"), text: t("s1Text") },
    {
      title: t("s2Title"),
      text: services ? t("s2Text", { services }) : t("s2Fallback"),
    },
    { title: t("s3Title"), text: t("s3Text") },
  ];

  return (
    <Section className="lg:gap-8">
      <SectionTitle>{t("title")}</SectionTitle>
      <ol className="m-0 grid list-none gap-5 p-0 lg:grid-cols-3 lg:gap-8">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-[40px_1fr] items-start gap-4 lg:flex lg:flex-col lg:gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-lg font-bold lg:size-11 lg:text-xl">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1 pt-2 lg:gap-3 lg:pt-0">
              <h3 className="m-0 text-lg font-bold leading-6 lg:text-xl lg:leading-7">
                {step.title}
              </h3>
              <p className="m-0 leading-6 text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
