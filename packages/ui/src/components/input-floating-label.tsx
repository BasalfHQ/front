"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";

type FloatingLabelProps = {
  value: string;
  setValue: (value: string) => void;
  label: string;
  className?: string;
  classNameLabel?: string;
};

const FloatingLabel = ({
  value,
  setValue,
  label,
  className,
  classNameLabel,
}: FloatingLabelProps) => {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const isFloated = focused || value.length > 0;

  return (
    <div className={cn("relative z-0 w-full max-w-fit", className)}>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        autoComplete="off"
        className="peer block h-10 w-full appearance-none rounded-none border-0 border-b-2 border-border bg-transparent px-0 pt-2.5 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
      />

      <Label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 top-4 origin-[0] cursor-text text-sm text-muted-foreground transition-all duration-300",
          isFloated && "-translate-y-5 scale-75",
          classNameLabel,
        )}
      >
        {label}
      </Label>

      {/* Animated focus line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-center bg-primary w-full"
        initial={false}
        animate={{
          scaleX: focused ? 1 : 0,
          opacity: focused ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
};

export default FloatingLabel;
