"use client";

import { Page } from "@repo/apis";
import { Session } from "next-auth";
import { useState } from "react";

const PAGE_CREATED_KEY = "page-created" as const;
const PAGE_UPDATED_KEY = "page-updated" as const;

const createEmptyPage = (session: Session | null): Omit<Page, "pageId"> => ({
  organizationId: session?.user.currentOrganization ?? "",
  websiteId: session?.user.currentWebsite ?? "",
  locale: "",
  url: "",
  slices: [],
  seo: { title: "", description: "", keywords: [], schemas: [] },
});

export function usePageCreated(
  session: Session | null,
): [
  Omit<Page, "pageId"> | null,
  (page: Omit<Page, "pageId">) => void,
  () => void,
  "loading" | "loaded",
] {
  const [page, setStatePage] = useState<Omit<Page, "pageId"> | null>(
    typeof window !== "undefined"
      ? (getStorage(PAGE_CREATED_KEY) ?? createEmptyPage(session))
      : null,
  );

  if (!page) return [page, setPage, clearPage, "loading"];

  function setPage(page: Omit<Page, "pageId">) {
    setStatePage(page);
    localStorage.setItem(PAGE_CREATED_KEY, JSON.stringify(page));
  }

  function clearPage() {
    setStatePage(null);
    localStorage.removeItem(PAGE_CREATED_KEY);
  }

  return [page, setPage, clearPage, "loaded"];
}

export function usePageUpdated(
  session: Session,
  initialPage: Page,
): [
  Page | null,
  (page: Page) => void,
  () => void,
  "loading" | "loaded" | "wrong-organization-or-website",
] {
  const [page, setStatePage] = useState<Page | null>(
    typeof window !== "undefined"
      ? (getStorage(PAGE_UPDATED_KEY) ?? initialPage)
      : null,
  );

  if (!page) return [page, setPage, clearPage, "loading"];

  function setPage(page: Page) {
    setStatePage(page);
    localStorage.setItem(PAGE_UPDATED_KEY, JSON.stringify(page));
  }

  if (
    page.organizationId !== session.user.currentOrganization ||
    page.websiteId !== session.user.currentWebsite
  ) {
    return [page, setPage, clearPage, "wrong-organization-or-website"];
  }

  function clearPage() {
    setStatePage(null);
    localStorage.removeItem(PAGE_UPDATED_KEY);
  }

  return [page, setPage, clearPage, "loaded"];
}

function getStorage(key: typeof PAGE_CREATED_KEY): Omit<Page, "pageId"> | null;
function getStorage(key: typeof PAGE_UPDATED_KEY): Page | null;
function getStorage(
  key: typeof PAGE_CREATED_KEY | typeof PAGE_UPDATED_KEY,
): Omit<Page, "pageId"> | Page | null {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}
