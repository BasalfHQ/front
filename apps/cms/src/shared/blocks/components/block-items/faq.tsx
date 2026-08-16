import { useRef } from "react";
import { useTranslations } from "@repo/i18n";
import { AutoSizeInput, Button, Input, Textarea, Tiptap } from "@repo/ui";
import { Trash2 } from "@repo/ui/icons";

let nextFaqKey = 0;

export function BlockFaq({
  faq,
  onChange,
  error,
}: {
  faq: {
    question: string;
    answer: string;
  }[];
  onChange: (faq: { question: string; answer: string }[]) => void;
  error?: string;
}) {
  const t = useTranslations("BlockForm");
  const keysRef = useRef<number[]>(faq.map(() => ++nextFaqKey));

  while (keysRef.current.length < faq.length) {
    keysRef.current.push(++nextFaqKey);
  }

  const handleDelete = (index: number) => {
    if (faq.length > 1) {
      keysRef.current.splice(index, 1);
      onChange(faq.filter((_, i) => i !== index));
    } else {
      // Reset: assign new key so Tiptap remounts with empty content
      keysRef.current[0] = ++nextFaqKey;
      onChange([{ question: "", answer: "" }]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-md">{t("attributes.faq.title")}</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex flex-col gap-10">
        {faq.map((item, index) => (
          <div key={keysRef.current[index]} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">
                {t("attributes.faq.question")}
              </p>
              <div className="flex gap-4 items-center">
                <AutoSizeInput
                  value={item.question}
                  onChange={(e) =>
                    onChange(
                      faq.map((item, i) =>
                        i === index
                          ? { ...item, question: e.target.value }
                          : item,
                      ),
                    )
                  }
                  className="border-muted-foreground shadow-none text-wrap"
                />
                <Trash2
                  className="size-6 cursor-pointer text-destructive hover:text-destructive/80"
                  onClick={() => handleDelete(index)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">
                {t("attributes.faq.answer")}
              </p>
              <Tiptap
                content={item.answer}
                onUpdate={(html: string) =>
                  onChange(
                    faq.map((item, i) =>
                      i === index ? { ...item, answer: html } : item,
                    ),
                  )
                }
                className="w-full h-fit min-h-[60px] prose prose-sm"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...faq, { question: "", answer: "" }])}
        >
          {t("attributes.faq.add")}
        </Button>
      </div>
    </div>
  );
}
