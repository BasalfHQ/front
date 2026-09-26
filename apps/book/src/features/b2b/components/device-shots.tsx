import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getB2bTranslations } from "../pricing";

// Screenshots of the app, supplied as static files:
//   public/b2b/{name}-desktop.png (1080×696) and public/b2b/{name}-phone.png (568×1200),
//   2× their displayed size; cropped from the top if the ratio differs.
// A marked placeholder is shown for each file that isn't there yet.
export type ScreenshotName = "profile" | "bookings" | "slots";

function screenshotSrc(name: ScreenshotName, device: "desktop" | "phone") {
  const src = `/b2b/${name}-${device}.png`;
  return existsSync(path.join(process.cwd(), "public", src)) ? src : null;
}

// A desktop browser frame with a phone frame overlapping it on the right.
export async function DeviceShots({
  locale,
  name,
  alt,
}: {
  locale: string;
  name: ScreenshotName;
  alt: string;
}) {
  const t = await getB2bTranslations(locale, "b2b.screenshot");

  return (
    <div className="relative aspect-[350/458] w-full max-w-[350px] lg:aspect-[620/470] lg:max-w-[620px]">
      <div className="absolute left-0 top-0 w-full overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_48px_-24px_hsl(var(--foreground)/0.35)] lg:w-[87%]">
        <div className="flex h-6 items-center gap-1.5 border-b border-border bg-muted px-3">
          <span className="size-2 rounded-full bg-input" />
          <span className="size-2 rounded-full bg-input" />
          <span className="size-2 rounded-full bg-input" />
        </div>
        <Screenshot
          src={screenshotSrc(name, "desktop")}
          alt={`${alt} ${t("desktop")}`}
          placeholder={t("placeholder")}
          className="aspect-[1498/869]"
          sizes="(min-width: 1024px) 540px, 350px"
        />
      </div>
      <div className="absolute right-0 top-[33%] w-[43%] rounded-[22px] bg-foreground p-1 shadow-[0_24px_48px_-24px_hsl(var(--foreground)/0.45)] lg:top-[25.5%] lg:w-[26.6%] lg:rounded-[24px] lg:p-[5px]">
        <Screenshot
          src={screenshotSrc(name, "phone")}
          alt={`${alt} ${t("phone")}`}
          placeholder={t("placeholder")}
          className="aspect-[284/600] rounded-[18px] lg:rounded-[20px]"
          sizes="165px"
        />
      </div>
    </div>
  );
}

function Screenshot({
  src,
  alt,
  placeholder,
  className,
  sizes,
}: {
  src: string | null;
  alt: string;
  placeholder: string;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-card ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,hsl(var(--muted))_0_8px,hsl(var(--secondary))_8px_16px)] p-2 text-center font-mono text-[10px] leading-4 text-muted-foreground"
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
