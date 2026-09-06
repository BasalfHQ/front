import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book",
  description: "Book your appointment",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="">
      <body className="min-h-full flex flex-col align-middle">
        <main className="max-w-[1024px] mx-auto">{children}</main>
      </body>
    </html>
  );
}
