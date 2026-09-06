import type { Block } from "../types";

type FaqBlock = Extract<Block, { type: "faq" }>;

export function Faq({ items }: { items: FaqBlock["content"] }) {
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
