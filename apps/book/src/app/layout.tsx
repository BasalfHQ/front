import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book",
  description: "Book your appointment",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  other: {
    "google-site-verification": "04sp6e87avP2LDhrjVzY6xmJMEgOEtJNGqtTnWgviWQ",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="">
      <head>
        <meta
          name="google-site-verification"
          content="04sp6e87avP2LDhrjVzY6xmJMEgOEtJNGqtTnWgviWQ"
        />
      </head>
      <body className="min-h-full flex flex-col align-middle">
        <main className="max-w-[1024px] mx-auto">{children}</main>
      </body>
    </html>
  );
}
