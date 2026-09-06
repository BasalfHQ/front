import type { Block } from "../types";

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
