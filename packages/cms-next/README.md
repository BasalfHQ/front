# @basalf/cms-next

Next.js (App Router) components to render a published [`@basalf/cms`](../cms) page by `slug` + `locale`. Server-only.

```tsx
import { Page } from "@basalf/cms-next";

export default function PricingPage() {
  return <Page slug="pricing" locale="en" url="https://example.com/en/pricing" />;
}
```

That's it — `Page` fetches the CMS page for that slug/locale, renders its content blocks (text, list, image, table, faq, headings, related pages, ...), and emits Article/FAQ JSON-LD. Calls Next's `notFound()` if no page matches.

## Setup

### 1. Env var (server-only)

```
BASALF_CMS_TOKEN=eyJhbGciOi...
```

Same token you'd pass to `new CMS(token)` from `@basalf/cms` — it's scoped to one organization/website. `Page`, `getPageMetadata`, `getAllPages` and `getPageBySlug` all import [`server-only`](https://www.npmjs.com/package/server-only), so bundling any of them into a Client Component throws a build error instead of leaking the token to the browser.

### 2. Tailwind

This package ships **no CSS and no Tailwind config of its own** — its components only reference Tailwind utility classes that must already be defined by your app's Tailwind setup (the same design-token classes used across Basalf apps, from `@repo/ui`'s `createTailwindConfig`):

- Colors (each backed by a `hsl(var(--token))` CSS var): `background`/`foreground`, `muted`/`muted-foreground`, `border`, `card`/`card-foreground`, `info`/`info-foreground`
- Used as: `text-foreground`, `text-muted-foreground`, `bg-muted`, `bg-muted/30`, `hover:bg-muted/50`, `border-border`, `bg-card`, `hover:border-info/60`, plus one arbitrary value `hover:shadow-[0_4px_16px_-4px_hsl(var(--info)/0.25)]`
- Everything else used is stock Tailwind (`space-y-4`, `rounded-lg`, `aspect-video`, `list-disc`, etc.)

If your app already uses `@repo/ui/tailwind.config` (every Basalf app does), the tokens exist — you only need to make sure Tailwind's `content` globs actually scan this package's compiled output, otherwise the classes above get purged:

```ts
// apps/<app>/tailwind.config.ts
content: [
  "./src/**/*.{ts,tsx}",
  "../../packages/ui/src/**/*.{ts,tsx}",
  // ...
  "../../packages/cms-next/dist/**/*.js",              // workspace usage
  "../../node_modules/@basalf/cms-next/dist/**/*.js",  // pure npm usage
],
```

If you're consuming this from a non-Basalf app (plain npm install, no `@repo/ui` preset), define these color tokens yourself — see `packages/ui/src/tailwind.config.ts` for the exact mapping to copy.

## API

### `<Page />`

```tsx
type PageProps = {
  slug: string;
  locale: string;
  url: string;                     // canonical URL, used in JSON-LD
  getHref?: (slug: string, locale: string) => string; // default: `/{locale}/{slug}`
  imageUrl?: string;                // Article JSON-LD image
  author?: { name: string; url?: string }; // Article JSON-LD author/publisher
  className?: string;               // appended to the outer <article>
};
```

`getHref` controls how links to *related* pages are built — this package doesn't know your routing, so pass your own (e.g. `(slug, locale) => \`/${locale}/service-provider/${orgId}/blog/${slug}\`` for book-style routes).

### `getPageMetadata(slug, locale, options?)`

Drop into `generateMetadata` for the matching route:

```tsx
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  return getPageMetadata(slug, locale, { image: "https://example.com/og.png" });
}
```

### `getAllPages(locale?)` / `getPageBySlug(slug, locale)`

Lower-level data helpers — use for `generateStaticParams`, sitemaps, or building your own listing page.

### `ArticleSchema` / `FaqSchema`

The JSON-LD components `Page` renders internally — exported in case you need them standalone.

## Supported blocks

`description`, `text`, `heading` (h2/h3), `list` (ordered/unordered), `image`, `faq`, `table`, `space`, `related` — same shape as `@basalf/cms`'s `Block` type.
