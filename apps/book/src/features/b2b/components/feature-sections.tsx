import { getB2bTranslations } from "../pricing";
import { cn } from "@repo/ui/lib/utils";
import { DeviceShots, type ScreenshotName } from "./device-shots";
import { Section } from "./section";

// "Your profile page", "Your bookings", "Your availability": text + screenshots,
// screenshots alternating left/right on desktop.
const FEATURES: { name: ScreenshotName; imageLeft: boolean }[] = [
  { name: "profile", imageLeft: true },
  { name: "bookings", imageLeft: false },
  { name: "slots", imageLeft: true },
];

export async function FeatureSections({ locale }: { locale: string }) {
  const t = await getB2bTranslations(locale, "b2b");

  return FEATURES.map(({ name, imageLeft }) => (
    <Section
      key={name}
      className={cn(
        "gap-4 lg:grid lg:items-center lg:gap-12",
        imageLeft
          ? "lg:grid-cols-[620px_minmax(0,1fr)]"
          : "lg:grid-cols-[minmax(0,1fr)_620px]",
      )}
    >
      <div className="flex flex-col gap-4 lg:gap-5">
        <h2 className="m-0 text-[28px] font-bold leading-[1.2] tracking-[-0.01em] lg:text-[32px] lg:leading-[1.15] lg:tracking-[-0.015em]">
          {t(`${name}.title`)}
        </h2>
        <p className="m-0 leading-7 text-muted-foreground">
          {t(`${name}.text`)}
        </p>
        <ul className="m-0 flex list-inside list-disc flex-col gap-2 p-0 leading-6 lg:gap-2.5 lg:leading-[26px]">
          <li>{t(`${name}.p1`)}</li>
          <li>{t(`${name}.p2`)}</li>
          <li>{t(`${name}.p3`)}</li>
        </ul>
      </div>
      <div
        className={cn(
          "flex justify-center pt-4 lg:pt-0",
          imageLeft && "lg:order-first",
        )}
      >
        <DeviceShots locale={locale} name={name} alt={t(`${name}.shot`)} />
      </div>
    </Section>
  ));
}
