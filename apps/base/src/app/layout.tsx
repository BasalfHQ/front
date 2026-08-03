import { RootLayout, createMetadata } from "@repo/ui";

export const metadata = createMetadata({
  name: "Base",
  description: "Base application",
  url: "https://base.basalf.com",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
