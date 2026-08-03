import type { Metadata } from "next";
import "../globals.css";

export interface SiteConfig {
  name: string;
  description: string;
  url?: string;
  ogImage?: string;
  twitterHandle?: string;
}

const defaultSiteConfig: SiteConfig = {
  name: "Basalf",
  description: "Basalf Application",
};

export function createMetadata(
  config: Partial<SiteConfig> = {},
  pageMetadata: Partial<Metadata> = {}
): Metadata {
  const site = { ...defaultSiteConfig, ...config };

  return {
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    metadataBase: site.url ? new URL(site.url) : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description: site.description,
      ...(site.ogImage && { images: [{ url: site.ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      ...(site.twitterHandle && { creator: site.twitterHandle }),
    },
    ...pageMetadata,
  };
}

export interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
  lang?: string;
}

export function RootLayout({
  children,
  className,
  lang = "en",
}: RootLayoutProps) {
  return (
    <html lang={lang}>
      <body className={className}>{children}</body>
    </html>
  );
}
