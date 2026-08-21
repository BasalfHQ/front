"use client";

import { useState } from "react";
import { Check, Clipboard } from "@repo/ui/icons";

export function Copy({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <div
      className="cursor-pointer border rounded-md p-0.5"
      onClick={handleCopy}
    >
      {isCopied ? (
        <Check className="size-6" />
      ) : (
        <Clipboard className="size-6" />
      )}
    </div>
  );
}
