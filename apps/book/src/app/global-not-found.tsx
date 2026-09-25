import type { Metadata } from "next";
import "./globals.css";

// URLs matching no route at all (the [locale] root layout can't render them).
export const metadata: Metadata = {
  title: "404 — Page not found",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">This page could not be found.</p>
        <a href="/" className="text-info underline">
          Book
        </a>
      </body>
    </html>
  );
}
