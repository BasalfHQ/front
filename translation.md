# Translation Setup (next-intl) - Turborepo

## Summary

i18n implemented with shared `@repo/i18n` package. Shared messages in package, app-specific messages in each app. `RootLayout` accepts `locale` and `messages` props and handles provider wrapping.

## Structure

```
packages/i18n/
├── src/
│   ├── routing.ts        # locale config (en, fr)
│   ├── navigation.ts     # locale-aware Link, redirect
│   ├── middleware.ts     # i18n middleware
│   ├── provider.tsx      # NextIntlClientProvider wrapper
│   └── index.ts          # exports
├── messages/
│   ├── en.json           # shared translations (common, nav, auth)
│   └── fr.json
└── package.json

apps/base/
├── messages/
│   ├── en.json           # app-specific (users, organization)
│   └── fr.json
├── src/
│   ├── middleware.ts     # imports i18nMiddleware
│   ├── i18n/
│   │   └── request.ts    # merges shared + app messages
│   └── app/
│       ├── layout.tsx    # root (returns children)
│       └── [locale]/
│           ├── layout.tsx  # passes locale/messages to RootLayout
│           └── page.tsx
└── next.config.ts        # withNextIntl plugin
```

## Key Files

### packages/i18n/src/routing.ts
```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
```

### apps/*/src/i18n/request.ts
Merges shared + app messages:
```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale, routing } from "@repo/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const shared = (await import(`@repo/i18n/messages/${locale}.json`)).default;
  const app = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: { ...shared, ...app },
  };
});
```

### apps/*/src/middleware.ts
```ts
import { i18nMiddleware } from "@repo/i18n";

export default i18nMiddleware;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### apps/*/src/app/[locale]/layout.tsx
```tsx
import { hasLocale, routing, setRequestLocale, getMessages } from "@repo/i18n";
import { notFound } from "next/navigation";
import { RootLayout } from "@repo/auth-ui";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <RootLayout lang={locale} locale={locale} messages={messages}>
      {children}
    </RootLayout>
  );
}
```

## Usage

### Server Components
```tsx
import { getTranslations, setRequestLocale } from "@repo/i18n";

export default function Page({ params }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <Content />;
}

async function Content() {
  const t = await getTranslations("users");
  const tCommon = await getTranslations("common");
  return <h1>{t("title")}</h1>;
}
```

### Client Components
```tsx
"use client";
import { useTranslations } from "@repo/i18n";

export function MyComponent() {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  return <p>{t("title")}</p>;
}
```

### Navigation
```tsx
import { Link } from "@repo/i18n";

<Link href="/users">Users</Link>
// Renders /users on en, /fr/users on fr
```

## Message Namespaces

### Shared (@repo/i18n/messages)
- `common`: save, cancel, delete, edit, loading, error
- `nav`: home, login, logout
- `auth`: signIn, signOut, email, password

### App-specific (apps/*/messages)
- `users`: title, addUser, editUser (base)
- `organization`: title, members (base)
- `cms`: title, pages, media (cms)

## Dependency Graph

```
@repo/i18n  ← standalone (next-intl)
    ↑
@repo/ui    ← uses Link from @repo/i18n
    ↑
@repo/auth-ui  ← uses I18nProvider from @repo/i18n
    ↑
apps/base, apps/cms
```
