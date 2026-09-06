export function Description({ content }: { content: string }) {
  return (
    <div
      className="text-lg text-muted-foreground leading-relaxed [&>p]:mb-3 last:[&>p]:mb-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function Text({ content }: { content: string }) {
  return (
    <div
      className="text-base text-foreground leading-relaxed [&>p]:mb-3 last:[&>p]:mb-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function Heading({
  children,
  level = 2,
}: {
  children: string;
  level?: 2 | 3;
}) {
  if (level === 3) {
    return <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>;
  }
  return <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>;
}
