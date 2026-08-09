// Config
export { routing, type Locale } from "./routing";

// Middleware
export { i18nMiddleware, i18nMiddlewareConfig } from "./middleware";

// Navigation (locale-aware)
export {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} from "./navigation";

// Provider
export { I18nProvider } from "./provider";
export { I18nClientProvider, type Namespace } from "./client-provider";

// Re-exports from next-intl
export { useTranslations, useLocale, useMessages } from "next-intl";
export {
  getTranslations,
  getLocale,
  getMessages,
  setRequestLocale,
} from "next-intl/server";
export { hasLocale } from "next-intl";
