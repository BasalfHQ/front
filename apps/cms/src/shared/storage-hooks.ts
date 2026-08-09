"use client";

import { Page } from "@repo/apis";
import { Session } from "next-auth";
import { useState } from "react";

const PAGE_CREATED_KEY = "page-created" as const;
const PAGE_UPDATED_KEY = "page-updated" as const;

const createEmptyPage = (session: Session): Omit<Page, "pageId"> => ({
  organizationId: session.user.currentOrganization ?? "",
  websiteId: session.user.currentWebsite ?? "",
  locale: "",
  url: "",
  slices: [],
  seo: [],
});

export function usePageCreated(
  session: Session,
): [Omit<Page, "pageId">, (page: Omit<Page, "pageId">) => void] {
  const [page, setStatePage] = useState<Omit<Page, "pageId">>(
    getStorage(PAGE_CREATED_KEY) ?? createEmptyPage(session),
  );

  function setPage(page: Omit<Page, "pageId">) {
    setStatePage(page);
    localStorage.setItem(PAGE_CREATED_KEY, JSON.stringify(page));
  }

  return [page, setPage];
}

export function usePageUpdated(
  session: Session,
  initialPage: Page,
): [Page, (page: Page) => void] | [Page, (page: Page) => void, string] {
  const [page, setStatePage] = useState<Page>(
    getStorage(PAGE_UPDATED_KEY) ?? initialPage,
  );

  function setPage(page: Page) {
    setStatePage(page);
    localStorage.setItem(PAGE_UPDATED_KEY, JSON.stringify(page));
  }

  if (
    page.organizationId !== session.user.currentOrganization ||
    page.websiteId !== session.user.currentWebsite
  ) {
    return [page, setPage, "Wrong organization or website"];
  }

  return [page, setPage];
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
