"use client";

import { useState } from "react";
import { useTranslations, Link } from "@repo/i18n";
import { Badge, Input } from "@repo/ui";
import { Cms } from "@repo/apis";

export function PagesList({ pages }: { pages: Cms.AllPages }) {
  const t = useTranslations("pages");
  const [search, setSearch] = useState("");

  const filteredPages = pages.filter((page) => {
    const query = search.toLowerCase();
    return (
      page.seo.title.toLowerCase().includes(query) ||
      page.url.toLowerCase().includes(query) ||
      page.seo.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="md:min-w-[400px]"
      />
      {filteredPages.length === 0 && (
        <p className="text-gray-500">{t("noResults")}</p>
      )}
      <div className="flex flex-col gap-1 rounded-md bg-accent/20 border w-fit md:min-w-[400px]">
        {filteredPages.map((page) => (
          <PageItem key={page.pageId} page={page} />
        ))}
      </div>
    </div>
  );
}

function PageItem({ page }: { page: Cms.AllPages[number] }) {
  return (
    <Link
      href={`/pages/${page.pageId}`}
      className="flex gap-4 py-2 px-4 hover:bg-accent items-center"
    >
      <p>{page.seo.title}</p>

      <div className="flex gap-1">
        <p className="text-sm text-gray-500">{page.locale}</p>
        <p className="text-sm text-gray-500">{page.url}</p>
      </div>

      {page.seo.schemas.length > 0 && (
        <div className="flex gap-2">
          {page.seo.schemas.map((schema) => (
            <Badge key={schema.type} variant="outline">
              {schema.type}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
