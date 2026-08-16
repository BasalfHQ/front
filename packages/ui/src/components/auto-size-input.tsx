import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

const AutoSizeInput = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, value, onChange, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  const resize = React.useCallback(() => {
    const textarea = textareaRef.current;
    const measure = measureRef.current;

    if (!textarea || !measure) return;

    measure.textContent = String(value || "") || " ";

    const minWidth = 300;
    const parentWidth = textarea.parentElement?.clientWidth ?? Infinity;

    const contentWidth = measure.offsetWidth + 24;
    const width = Math.max(minWidth, Math.min(contentWidth, parentWidth));

    const isMaxWidth = contentWidth > parentWidth;

    textarea.style.width = `${width}px`;

    // Don't allow wrapping until we've reached max width
    textarea.style.whiteSpace = isMaxWidth ? "pre-wrap" : "nowrap";

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  React.useLayoutEffect(() => {
    resize();
  }, [resize]);

  React.useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="absolute invisible whitespace-pre text-base md:text-sm"
      />

      <textarea
        {...props}
        ref={(node) => {
          textareaRef.current = node;

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        value={value}
        onChange={onChange}
        rows={1}
        className={cn(
          "min-w-[300px] max-w-full min-h-[30px] resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
      />
    </>
  );
});

AutoSizeInput.displayName = "AutoSizeInput";

export { AutoSizeInput };
