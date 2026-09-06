"use client";

import { Cms } from "@repo/apis";
import { useTranslations } from "@repo/i18n";
import { ChevronUp, ChevronDown, Trash2 } from "@repo/ui/icons";
import { BlockLevel } from "./level";
import { BlockContent } from "./content";
import { BlockList } from "./list";
import { BlockRelated } from "./related";
import { BlockFaq } from "./faq";
import type { BlockErrors } from "@/features/create-page/components/form";

export function BlockItem({
  block,
  isFirst,
  isLast,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  errors,
}: {
  block: Cms.Block;
  isFirst: boolean;
  isLast: boolean;
  onChange: (block: Cms.Block) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  errors?: BlockErrors;
}) {
  const t = useTranslations("BlockForm");

  const hasErrors = errors && Object.keys(errors).length > 0;

  return (
    <div
      className={`flex gap-2 border rounded-md p-2 bg-accent/20 w-full min-h-[100px] pr-4 ${hasErrors ? "border-destructive" : ""}`}
    >
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
        <div className="w-full flex gap-3 items-center justify-end text-sm text-muted-foreground">
          {t(`types.${block.type}.name`)}
          <Trash2
            className="size-6 cursor-pointer text-destructive hover:text-destructive/80"
            onClick={onDelete}
          />
        </div>
        <div className="w-full flex flex-col gap-8 font-medium pb-6">
          {"content" in block && typeof block.content === "string" && (
            <BlockContent
              content={block.content}
              onChange={(content) => {
                // @ts-expect-error - Just Block type error
                onChange({ ...block, content });
              }}
              error={errors?.content}
            />
          )}

          {block.type === "list" && (
            <BlockList
              list={block.content}
              onChange={(content) => onChange({ ...block, content })}
              error={errors?.items}
            />
          )}

          {"level" in block && (
            <BlockLevel
              level={block.level}
              onChange={(level) => onChange({ ...block, level })}
            />
          )}

          {block.type === "related" && (
            <BlockRelated
              related={block.content}
              onChange={(content) => onChange({ ...block, content })}
              error={errors?.items}
            />
          )}

          {block.type === "space" && (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-md">
                {t("attributes.space.title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("attributes.space.description")}
              </p>
            </div>
          )}

          {block.type === "faq" && (
            <BlockFaq
              faq={block.content}
              onChange={(content) => onChange({ ...block, content })}
              error={errors?.items}
            />
          )}

          {block.type === "image" && errors && (
            <div className="flex flex-col gap-1">
              {errors.src && (
                <p className="text-xs text-destructive">{errors.src}</p>
              )}
              {errors.alt && (
                <p className="text-xs text-destructive">{errors.alt}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
