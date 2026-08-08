import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: {
    name: "NEXT_LOCALE",
    domain: process.env.NODE_ENV === "production" ? ".basalf.com" : undefined,
  },
});

export type Locale = (typeof routing.locales)[number];
