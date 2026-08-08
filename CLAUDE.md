# Basalf Front

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
- `@repo/ui` — UI components (Button, Input, etc.)
- `@repo/auth` — Auth logic (Cognito, NextAuth config)
- `@repo/apis` — API clients (server-side only)
- `@repo/auth-ui` — Combined auth + UI for app layouts (RootLayout with nav + auth)
