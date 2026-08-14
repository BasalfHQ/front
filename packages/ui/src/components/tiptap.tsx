"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon } from "lucide-react";
import { cn } from "../lib/utils";

export type TiptapProps = {
  content?: string;
  onUpdate?: (html: string) => void;
  className?: string;
  error?: string;
};

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex gap-1 border-b p-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "rounded p-1.5 hover:bg-accent",
          editor.isActive("bold") && "bg-accent text-accent-foreground",
        )}
      >
        <Bold className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "rounded p-1.5 hover:bg-accent",
          editor.isActive("italic") && "bg-accent text-accent-foreground",
        )}
      >
        <Italic className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "rounded p-1.5 hover:bg-accent",
          editor.isActive("underline") && "bg-accent text-accent-foreground",
        )}
      >
        <UnderlineIcon className="size-4" />
      </button>
    </div>
  );
}

export function Tiptap({ content, onUpdate, className, error }: TiptapProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content ?? "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "rounded-md border flex flex-col overflow-hidden",
          error && "border-destructive",
          className,
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className="p-2 min-h-[60px] flex-1 overflow-y-auto [&_.tiptap]:outline-none [&_.tiptap]:h-full"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
