import createMiddleware from "next-intl/middleware";
import { routing } from "@repo/i18n";

// No hreflang `Link` header: next-intl would build it from the current path,
// wrong for translated slugs (/fr/for/barbier -> /for/barbier). Pages declare
// their alternates in their metadata instead.
export default createMiddleware({ ...routing, alternateLinks: false });

// Metadata images (/en/for/barber/opengraph-image-…) keep their locale prefix:
// served as-is, never redirected.
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
