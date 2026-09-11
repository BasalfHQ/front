import "server-only";
import NextImage from "next/image";
import type { AllPages, Block } from "@basalf/cms";

export function Space() {
  return <div className="h-6" aria-hidden="true" />;
}

export function Description({ content }: { content: string }) {
  return (
    <div
      className="text-lg text-muted-foreground leading-relaxed [&>p]:mb-3 last:[&>p]:mb-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function Text({ content }: { content: string }) {
  return (
    <div
      className="text-base text-foreground leading-relaxed [&>p]:mb-3 last:[&>p]:mb-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function Heading({
  children,
  level = 2,
}: {
  children: string;
  level?: 2 | 3;
}) {
  if (level === 3) {
    return <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>;
  }
  return <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>;
}

type ListBlock = Extract<Block, { type: "list" }>;

export function List({ list }: { list: ListBlock["content"] }) {
  const Tag = list.ordered ? "ol" : "ul";
  const listStyle = list.ordered ? "list-decimal" : "list-disc";

  return (
    <Tag className={`${listStyle} list-inside space-y-2 my-4 ml-2`}>
      {list.items.map((item, index) => (
        <li
          key={index}
          className="text-foreground [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
      ))}
    </Tag>
  );
}

type ImageBlockContent = Extract<Block, { type: "image" }>["content"];

export function ImageBlock({ image }: { image: ImageBlockContent }) {
  return (
    <figure className="my-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <NextImage
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
        {image.alt}
      </figcaption>
    </figure>
  );
}

type FaqBlockContent = Extract<Block, { type: "faq" }>["content"];

export function Faq({ items }: { items: FaqBlockContent }) {
  return (
    <div className="my-6 space-y-4">
      {items.map((item, index) => (
        <details
          key={index}
          className="border border-border rounded-lg overflow-hidden"
        >
          <summary className="cursor-pointer p-4 font-medium text-foreground hover:bg-muted/50">
            {item.question}
          </summary>
          <div
            className="p-4 pt-0 text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </details>
      ))}
    </div>
  );
}

type TableBlockContent = Extract<Block, { type: "table" }>["content"];

export function Table({ table }: { table: TableBlockContent }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        {table.headers && (
          <thead className="bg-muted">
            <tr>
              {table.headers.map((header, i) => (
                <th
                  key={i}
                  className="border-b border-border px-4 py-2.5 text-left font-medium text-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((row, r) => (
            <tr
              key={r}
              className="border-b border-border last:border-0 even:bg-muted/30"
            >
              {row.map((cell, c) => (
                <td key={c} className="px-4 py-2.5 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type GetHref = (slug: string, locale: string) => string;

type RelatedProps = {
  urls: string[];
  allPages: AllPages;
  locale: string;
  getHref: GetHref;
};

export function Related({ urls, allPages, locale, getHref }: RelatedProps) {
  const relatedPages = urls
    .map((url) => allPages.find((p) => p.url === `/${url}` || p.url === url))
    .filter((p): p is AllPages[number] => p !== undefined);

  if (relatedPages.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold mb-4">Related pages</h2>
      <div className="space-y-4">
        {relatedPages.map((related) => (
          <a
            key={related.url}
            href={getHref(related.url, related.locale)}
            className="block rounded-lg border border-border bg-card p-4 shadow-[0_0_0_rgba(0,0,0,0)] transition-all hover:border-info/60 hover:shadow-[0_4px_16px_-4px_hsl(var(--info)/0.25)]"
          >
            <h3 className="font-medium mt-2">{related.seo.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {related.seo.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
