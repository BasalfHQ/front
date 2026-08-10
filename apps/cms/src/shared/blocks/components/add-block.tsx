import { Block } from "@repo/apis";
import { useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui";
import { useState } from "react";

type BaseBlockType = Exclude<Block["type"], "image">;
const blockTypes: BaseBlockType[] = [
  "description",
  "text",
  "heading",
  "list",
  // "image",
  "faq",
  "space",
  "related",
];

const baseBlocks: Record<BaseBlockType, Block> = {
  description: { type: "description", content: "" },
  text: { type: "text", content: "" },
  heading: { type: "heading", content: "", level: 2 },
  list: { type: "list", content: { ordered: false, items: [{ text: "" }] } },
  // image: { type: "image", content: { src: "", alt: "" } },
  faq: { type: "faq", content: [{ question: "", answer: "" }] },
  space: { type: "space" },
  related: { type: "related", content: [] },
};

export function AddNewBlock({
  value,
  onAdd,
}: {
  value: Block[];
  onAdd: (blocks: Block[]) => void;
}) {
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const t = useTranslations("BlockForm");

  if (!openSelection)
    return (
      <Button
        variant="outline"
        className="border bg-transparent shadow-none w-full max-w-[500px]"
        onClick={() => setOpenSelection(true)}
      >
        {t("addNewBlock")}
      </Button>
    );

  function handleAddBlock(type: BaseBlockType) {
    onAdd([...value, baseBlocks[type]]);
    setOpenSelection(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <p
        onClick={() => setOpenSelection(false)}
        className="text-gray-500 hover:text-gray-700 cursor-pointer underline text-md"
      >
        {t("cancel")}
      </p>
      <div className="flex flex-wrap gap-2">
        {blockTypes.map((type) => (
          <div
            key={type}
            className="border bg-transparent shadow-none w-full min-w-[200px] flex-1 flex flex-col p-2 items-center justify-center justify-between cursor-pointer bg-accent/20 hover:bg-accent/60"
            onClick={() => handleAddBlock(type)}
          >
            <p>{t(`types.${type}.name`)}</p>
            <p className="text-sm text-muted-foreground">
              {t(`types.${type}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
