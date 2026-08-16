import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@repo/i18n";
import { cn } from "../lib/utils";
import "../globals.css";
import { Toaster } from "sonner";

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
  pageMetadata: Partial<Metadata> = {},
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

export type NavItem = {
  label: string;
  href: string;
  adminOnly?: boolean;
  authOnly?: boolean;
  subItems?: NavItem[];
};

export interface NavProps {
  navItems?: NavItem[];
  authSlot?: React.ReactNode;
}

const NavUi = ({ label, href }: { label: string; href: string }) => {
  return (
    <Link href={href} className="hover:underline text-gray-700">
      {label}
    </Link>
  );
};

export function Nav({ navItems, authSlot }: NavProps) {
  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b w-full">
      <div className="flex items-center gap-4 md:gap-10">
        <Link
          href={
            process.env.NEXT_PUBLIC_STAGE === "prod"
              ? "https://basalf.com"
              : "http://localhost:3000"
          }
        >
          <Image src="/logo.png" alt="Basalf" width={60} height={60} />
        </Link>
        <div className="flex gap-4 pt-2">
          {navItems?.map((item) => (
            <NavUi key={item.href} label={item.label} href={item.href} />
          ))}
        </div>
      </div>
      {authSlot}
    </nav>
  );
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
      <body className={cn("flex min-h-screen flex-col w-full overflow-x-hidden", className)}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
