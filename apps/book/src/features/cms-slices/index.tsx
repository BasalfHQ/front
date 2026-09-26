import { Description, Text, Heading } from "./components/text";
import { List } from "./components/list";
import { Image } from "./components/image";
import { Faq } from "./components/faq";
import { Table } from "./components/table";
import type { Block } from "./types";

// Renders one CMS content slice. Shared by the org blog (service-provider
// pages) and the B2B pages (/for): both render CMS page bodies.
export function SliceRenderer({ slice }: { slice: Block }) {
  switch (slice.type) {
    case "description":
      return <Description content={slice.content} />;
    case "text":
      return <Text content={slice.content} />;
    case "heading":
      return <Heading level={slice.level}>{slice.content}</Heading>;
    case "list":
      return <List list={slice.content} />;
    case "image":
      return <Image image={slice.content} />;
    case "faq":
      return <Faq items={slice.content} />;
    case "space":
      return <div className="h-6" aria-hidden="true" />;
    case "related":
      return null;
    case "table":
      return <Table table={slice.content} />;
  }
}

export { Description, Text, Heading } from "./components/text";
export { List } from "./components/list";
export { Image } from "./components/image";
export { Table } from "./components/table";
export type { Block } from "./types";
