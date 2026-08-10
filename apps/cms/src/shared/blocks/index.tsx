"use client";

import { Block } from "@repo/apis";
import { useTranslations } from "@repo/i18n";
import { Button, Input, Label, Switch, Tiptap } from "@repo/ui";
import { ChevronUp, ChevronDown, Trash } from "@repo/ui/icons";
import { AddNewBlock } from "./components/add-block";
import { cn } from "@repo/ui/lib/utils";

export function BlockForm({
  title,
  description,
  value,
  onChange,
  className,
}: {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  value: Block[];
  onChange: (blocks: Block[]) => void;
  className?: string;
}) {
  const t = useTranslations("BlockForm");

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= value.length) return;

    const reordered = [...value];

    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];

    onChange(reordered);
  }

  function updateBlock(index: number, block: Block) {
    const updated = [...value];
    updated[index] = block;

    onChange(updated);
  }

  return (
    <div className={cn("flex flex-col gap-4 w-full items-center", className)}>
      {(title || description) && (
        <div className="w-full flex flex-col gap-2">
          {title && <div className="text-xl font-medium">{title}</div>}

          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
      )}

      <div className="flex flex-col gap-2 w-full">
        {value.map((block, index) => (
          <BlockItem
            key={index}
            block={block}
            isFirst={index === 0}
            isLast={index === value.length - 1}
            onChange={(updatedBlock) => updateBlock(index, updatedBlock)}
            onMoveUp={() => moveBlock(index, -1)}
            onMoveDown={() => moveBlock(index, 1)}
          />
        ))}
      </div>

      <AddNewBlock value={value} onAdd={onChange} />
    </div>
  );
}

function BlockItem({
  block,
  isFirst,
  isLast,
  onChange,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  isFirst: boolean;
  isLast: boolean;
  onChange: (block: Block) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const t = useTranslations("BlockForm");

  return (
    <div className="flex gap-2 border rounded-md p-2 bg-accent/20 w-full min-h-[100px] pr-4">
      <div className="flex flex-col items-center justify-between">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="disabled:opacity-20"
        >
          <ChevronUp className="size-5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="disabled:opacity-20"
        >
          <ChevronDown className="size-5" />
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="w-full flex justify-end text-sm text-muted-foreground">
          {t(`types.${block.type}.name`)}
        </div>
        <div className="w-full flex flex-col gap-8 font-medium pb-6">
          {"content" in block && typeof block.content === "string" && (
            <BlockContent
              content={block.content}
              onChange={(content) => {
                // @ts-expect-error - Just Block type error
                onChange({ ...block, content });
              }}
            />
          )}

          {block.type === "list" && (
            <BlockList
              list={block.content}
              onChange={(content) => onChange({ ...block, content })}
            />
          )}

          {"level" in block && (
            <BlockLevel
              level={block.level}
              onChange={(level) => onChange({ ...block, level })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function BlockContent({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="w-full flex flex-col gap-2 font-medium">
      <p>{t("attributes.content")}</p>
      <Tiptap
        content={content}
        onUpdate={(html: string) => {
          // @ts-expect-error - Just Block type error
          onChange({ ...block, content: html });
        }}
        className="w-full h-[300px] min-h-[60px] prose prose-sm"
      />
    </div>
  );
}

function BlockLevel({
  level,
  onChange,
}: {
  level: 2 | 3 | undefined;
  onChange: (level: 2 | 3 | undefined) => void;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md">{t("attributes.level")}</p>
      <div className="flex gap-2">
        <p
          className={cn(
            "border rounded-md p-1 w-[100px] flex items-center justify-center text-sm cursor-pointer",
            level === 3 && "bg-accent",
          )}
          onClick={() => onChange(level === 3 ? undefined : 3)}
        >
          {t("attributes.small")}
        </p>
        <p
          className={cn(
            "border rounded-md p-1 w-[100px] flex items-center justify-center text-md cursor-pointer",
            level === 2 && "bg-accent",
          )}
          onClick={() => onChange(level === 2 ? undefined : 2)}
        >
          {t("attributes.medium")}
        </p>
      </div>
    </div>
  );
}

function BlockList({
  list,
  onChange,
}: {
  list: {
    ordered?: boolean | undefined;
    items: {
      text: string;
    }[];
  };
  onChange: (list: {
    ordered?: boolean | undefined;
    items: {
      text: string;
    }[];
  }) => void;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md">{t("attributes.list")}</p>
      <div className="flex gap-2 items-center">
        <Switch
          checked={list.ordered}
          onCheckedChange={(checked) => onChange({ ...list, ordered: checked })}
        />
        <Label
          onClick={() => onChange({ ...list, ordered: !list.ordered })}
          className="cursor-pointer"
        >
          {t("attributes.ordered")}
        </Label>
      </div>
      <div className="flex flex-col c">
        {list.items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <p className="text-sm w-[20px] text-center">
              {list.ordered ? `${index + 1}.` : "•"}
            </p>
            <Input
              value={item.text}
              id={`list-item-${index}`}
              onChange={(e) =>
                onChange({
                  ...list,
                  items: list.items.map((item, i) =>
                    i === index ? { ...item, text: e.target.value } : item,
                  ),
                })
              }
              className="border-none shadow-none p-0 focus-visible:ring-none focus-visible:border-none"
              onKeyDown={(e) => {
                console.log(item.text.length);
                console.log(e.key);
                if (
                  (e.key === "Delete" || e.key === "Backspace") &&
                  item.text.length == 0
                ) {
                  onChange({
                    ...list,
                    items: list.items.filter((item, i) => i !== index),
                  });
                } else if (e.key === "Enter") {
                  onChange({
                    ...list,
                    items: [...list.items, { text: "" }],
                  });
                  document.getElementById(`list-item-${index + 1}`)?.focus();
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
