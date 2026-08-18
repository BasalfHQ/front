import { i18nMiddleware } from "@repo/i18n";

export default i18nMiddleware;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
