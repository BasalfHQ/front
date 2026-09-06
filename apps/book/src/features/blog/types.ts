import type { Book } from "@repo/apis";

export type Page = Book.Page;
export type PageSummary = Book.AllPages[number];
export type Block = Book.Page["slices"][number];
