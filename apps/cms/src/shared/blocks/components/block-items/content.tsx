import { useTranslations } from "@repo/i18n";
import { Tiptap } from "@repo/ui";

export function BlockContent({
  content,
  onChange,
  error,
}: {
  content: string;
  onChange: (content: string) => void;
  error?: string;
}) {
  const t = useTranslations("BlockForm");
  return (
    <div className="w-full flex flex-col gap-2 font-medium">
      <p>{t("attributes.content")}</p>
      <Tiptap
        content={content}
        onUpdate={(html: string) => {
          onChange(html);
        }}
        className={`w-full h-fit min-h-[60px] prose prose-sm ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
