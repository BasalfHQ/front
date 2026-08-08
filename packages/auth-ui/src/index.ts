export { RootLayout, type RootLayoutProps, type NavItem } from "./root-layout";

// Re-export from @repo/ui
export { createMetadata, type SiteConfig, Button, buttonVariants } from "@repo/ui";

// Re-export from @repo/config
export { env } from "@repo/config";

// Re-export from @repo/auth
export {
  getAuthOptions,
  getCognito,
  Cognito,
  auth,
  getSession,
  isSessionExpired,
  getAuthHeaders,
  isAdmin,
  type Organization,
} from "@repo/auth";
