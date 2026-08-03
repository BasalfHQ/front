import { RootLayout, createMetadata } from "@repo/ui";

export const metadata = createMetadata({
  name: "CMS",
  description: "CMS application",
  url: "https://cms.basalf.com",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
