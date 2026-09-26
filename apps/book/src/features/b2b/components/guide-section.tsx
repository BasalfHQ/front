import { Heading, Image, List, Table, Text } from "@/features/cms-slices";
import type { GuideSlice } from "../content";
import { Section, SectionTitle } from "./section";

// Long-form occupation content from the CMS. A leading heading slice becomes
// the section title; the rest renders like a blog article.
export function GuideSection({ slices }: { slices: GuideSlice[] }) {
  if (slices.length === 0) return null;
  const [first, ...rest] = slices;
  const title = first.type === "heading" ? first.content : null;
  const body = title ? rest : slices;

  return (
    <Section className="gap-4 lg:gap-5">
      {title && <SectionTitle>{title}</SectionTitle>}
      <div className="max-w-[720px] leading-7">
        {body.map((slice, i) => {
          switch (slice.type) {
            case "heading":
              return (
                <Heading key={i} level={slice.level}>
                  {slice.content}
                </Heading>
              );
            case "text":
              return <Text key={i} content={slice.content} />;
            case "list":
              return <List key={i} list={slice.content} />;
            case "image":
              return <Image key={i} image={slice.content} />;
            case "table":
              return <Table key={i} table={slice.content} />;
          }
        })}
      </div>
    </Section>
  );
}
