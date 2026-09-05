import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book",
  description: "Book your appointment",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
