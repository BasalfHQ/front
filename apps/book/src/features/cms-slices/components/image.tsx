import NextImage from "next/image";
import type { Block } from "../types";

type ImageBlock = Extract<Block, { type: "image" }>;

export function Image({ image }: { image: ImageBlock["content"] }) {
  return (
    <figure className="my-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <NextImage
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
        {image.alt}
      </figcaption>
    </figure>
  );
}
