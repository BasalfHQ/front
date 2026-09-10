# Basalf Front

Basalf is a platform for multiple products (see [`../AGENTS.md`](../AGENTS.md)) — **book** is the current flagship product, not the whole picture. New products get their own app(s) here, following the same structure.

## Apps (`apps/*`)

Platform:

| App | Purpose |
|-----|---------|
| `base` | Org/user account settings — talks to `base-user-mgt-bff` |
| `host` | Website domain/cert settings for an org's site — talks to `host-mgt-bff` |
| `cms` | Page content management — talks to `cms-mgt-bff` |

Book product:

| App | Purpose |
|-----|---------|
| `book` | Public customer-facing booking site (doctolib/treatwell-like) — talks to `book-mgt-bff` |
| `slot` | Host-side dashboard to manage services and availability slots — talks to `slot-mgt-bff` |

`test` is a scratch/sandbox app, not wired to any BFF.

Each app talks to its matching backend only through `@repo/apis`'s `{name}-mgt-bff` client (see naming convention in `../AGENTS.md`).

## Architecture Rules

### API Calls - Server-Side Only
API calls to backend services must NEVER be made client-side.
- Use server actions for all CRUD operations
- Client components call server actions, not API functions directly
- `@repo/apis` functions only used in server components or server actions

### Data Fetching - Prefer SSR
Prefer server-side data fetching over client-side useEffect.
- Fetch data in server components or server actions
- Pass data as props to client components
- Avoid useEffect for data fetching — use SSR or server actions
- useEffect should be rare — only for browser-only APIs, subscriptions, or DOM manipulation

Example:
```tsx
// Good: SSR fetch
async function Page() {
  const data = await getData();
  return <ClientComponent data={data} />;
}

// Bad: useEffect fetch
function Page() {
  const [data, setData] = useState();
  useEffect(() => { getData().then(setData); }, []);
}
```

### App Folder Structure
The `app/` folder should ONLY contain routing logic.
- `app/` — page.tsx files with minimal routing logic, imports from features
- `features/` — components, server actions, business logic
- Page files should be thin wrappers that import from features

Example:
```tsx
// app/organization/page.tsx
import { OrganizationPage } from "@/features/organization";

export default function Page() {
  return <OrganizationPage />;
}
```

## Packages

- `@repo/config` — Environment config (NEXT_PUBLIC_STAGE for stage detection)
- `@repo/ui` — UI components (Button, Input, booking-specific ones like Calendar/SlotChip, etc.)
- `@repo/auth` — Auth logic (Cognito, NextAuth config)
- `@repo/apis` — API clients per backend, one folder per `{name}-mgt-bff` (server-side only)
- `@repo/auth-ui` — Combined auth + UI for app layouts (RootLayout with nav + auth)
- `@repo/i18n` — next-intl routing, middleware, providers
- `@repo/esco` — ESCO occupation taxonomy (data in `../esco/`) + occupation-select component
- `@basalf/cms` — Published npm package: embeddable CMS client (openapi-fetch) for external sites, wraps `cms-mgt-bff`
- `@basalf/slot` — Published npm package: embeddable booking widget client (`SlotClient`) for external sites, wraps `slot-mgt-bff`
