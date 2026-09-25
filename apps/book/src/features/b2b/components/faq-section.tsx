import { ChevronDown } from "@repo/ui/icons";
import { CmsHtml } from "./hero";
import { Section, SectionTitle } from "./section";

export function FaqSection({
  title,
  faq,
}: {
  title: string;
  // CMS faq slice, answers are HTML
  faq: { question: string; answer: string }[];
}) {
  if (faq.length === 0) return null;

  return (
    <Section className="gap-4 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-3">
        {faq.map((item) => (
          <details
            key={item.question}
            className="group overflow-hidden rounded-lg border border-border bg-card"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium lg:px-5 lg:py-3.5 [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown
                className="size-4 shrink-0 transition-transform duration-150 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <CmsHtml
              html={item.answer}
              className="px-4 pb-4 leading-relaxed lg:px-5 lg:pb-5 [&_p]:m-0 [&_p+p]:mt-3"
            />
          </details>
        ))}
      </div>
    </Section>
  );
}
