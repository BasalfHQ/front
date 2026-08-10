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
  seo: [],
});

export function usePageCreated(
  session: Session | null,
): [
  Omit<Page, "pageId"> | null,
  (page: Omit<Page, "pageId">) => void,
  "loading" | "loaded",
] {
  const [page, setStatePage] = useState<Omit<Page, "pageId"> | null>(
    typeof window !== "undefined"
      ? (getStorage(PAGE_CREATED_KEY) ?? createEmptyPage(session))
      : null,
  );

  if (!page) return [page, setPage, "loading"];

  function setPage(page: Omit<Page, "pageId">) {
    setStatePage(page);
    localStorage.setItem(PAGE_CREATED_KEY, JSON.stringify(page));
  }

  return [page, setPage, "loaded"];
}

export function usePageUpdated(
  session: Session,
  initialPage: Page,
): [
  Page | null,
  (page: Page) => void,
  "loading" | "loaded" | "wrong-organization-or-website",
] {
  const [page, setStatePage] = useState<Page | null>(
    typeof window !== "undefined"
      ? (getStorage(PAGE_UPDATED_KEY) ?? initialPage)
      : null,
  );

  if (!page) return [page, setPage, "loading"];

  function setPage(page: Page) {
    setStatePage(page);
    localStorage.setItem(PAGE_UPDATED_KEY, JSON.stringify(page));
  }

  if (
    page.organizationId !== session.user.currentOrganization ||
    page.websiteId !== session.user.currentWebsite
  ) {
    return [page, setPage, "wrong-organization-or-website"];
  }

  return [page, setPage, "loaded"];
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
