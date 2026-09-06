"use client";

import { Cms } from "@repo/apis";
import { Session } from "next-auth";
import { useState } from "react";

export const PAGE_CREATED_KEY = "page-created" as const;
export const PAGE_UPDATED_KEY = "page-updated" as const;

const createEmptyPage = (session: Session | null): Omit<Cms.Page, "pageId"> => ({
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
  Omit<Cms.Page, "pageId"> | null,
  (page: Omit<Cms.Page, "pageId">) => void,
  () => void,
  "loading" | "loaded",
] {
  const [page, setStatePage] = useState<Omit<Cms.Page, "pageId"> | null>(
    typeof window !== "undefined"
      ? (getStorage(PAGE_CREATED_KEY) ?? createEmptyPage(session))
      : null,
  );

  if (!page) return [page, setPage, clearPage, "loading"];

  function setPage(page: Omit<Cms.Page, "pageId">) {
    setStatePage(page);
    localStorage.setItem(PAGE_CREATED_KEY, JSON.stringify(page));
  }

  function clearPage() {
    setStatePage(null);
    localStorage.removeItem(PAGE_CREATED_KEY);
  }

  return [page, setPage, clearPage, "loaded"];
}

function getStoredPage(initialPage: Cms.Page): Cms.Page | null {
  if (typeof window === "undefined") return null;
  const stored = getStorage(PAGE_UPDATED_KEY);
  if (!stored || stored.pageId !== initialPage.pageId) return initialPage;
  return {
    ...initialPage,
    ...stored,
    seo: {
      ...initialPage.seo,
      ...stored.seo,
      schemas: stored.seo?.schemas ?? initialPage.seo.schemas,
      keywords: stored.seo?.keywords ?? initialPage.seo.keywords,
    },
  };
}

export function usePageUpdated(
  session: Session | null,
  initialPage: Cms.Page,
): [
  Cms.Page | null,
  (page: Cms.Page) => void,
  () => void,
  "loading" | "loaded" | "wrong-organization-or-website",
] {
  const [page, setStatePage] = useState<Cms.Page | null>(
    getStoredPage(initialPage),
  );

  if (!page || !session) return [page, setPage, clearPage, "loading"];

  function setPage(page: Cms.Page) {
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

function getStorage(key: typeof PAGE_CREATED_KEY): Omit<Cms.Page, "pageId"> | null;
function getStorage(key: typeof PAGE_UPDATED_KEY): Cms.Page | null;
function getStorage(
  key: typeof PAGE_CREATED_KEY | typeof PAGE_UPDATED_KEY,
): Omit<Cms.Page, "pageId"> | Cms.Page | null {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}
