"use client";

import { Block } from "@repo/apis";
import { AddNewBlock } from "./components/add-block";
import { cn } from "@repo/ui/lib/utils";
import { BlockItem } from "./components/block-items";
import type { BlockErrors } from "@/features/create-page/components/form";

export function BlockForm({
  title,
  description,
  value,
  onChange,
  className,
  errors,
}: {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  value: Block[];
  onChange: (blocks: Block[]) => void;
  className?: string;
  errors?: (BlockErrors | null)[];
}) {
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

          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
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
            onDelete={() => onChange(value.filter((_, i) => i !== index))}
            errors={errors?.[index] ?? undefined}
          />
        ))}
      </div>

      <AddNewBlock value={value} onAdd={onChange} />
    </div>
  );
}
