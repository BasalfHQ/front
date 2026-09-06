import { Cms } from "@repo/apis";

const message = `
Generate a complete web page as one valid JSON object based on the user's request.

## OUTPUT RULES

- Return ONLY the JSON object. No markdown fences, no text outside it.
- Must pass JSON.parse() directly.
- Double quotes for all keys and string values. No trailing commas, no comments, no JS syntax.
- Conform exactly to the TypeScript structure below. No extra properties, no missing required ones.
- Content must be in the requested language.

## CRITICAL: HTML ATTRIBUTES IN JSON STRINGS

HTML inside JSON string values MUST use single quotes for all HTML attributes. Double quotes inside a JSON string break JSON.parse().

CORRECT: {"content": "<a href='/my-page'>link</a>"}
CORRECT: {"content": "<img src='/img.jpg' alt='photo'>"}
WRONG:   {"content": "<a href=\"/my-page\">link</a>"}
WRONG:   {"content": "<a href="/my-page">link</a>"}

Use single quotes for EVERY HTML attribute: href, src, alt, class, id, etc.

## REQUEST

locale: "{LOCALE}"
prompt: "{PROMPT}"
existingPages: {EXISTING_PAGES}

## EXISTING PAGES

Use existingPages (array of {url, title, description}) to:
- Avoid duplicating content or URLs
- Create internal links using existing URLs only (never invent URLs)
- Populate "related" slices with existing URLs
- If topic already exists, target a different angle/subtopic

## TYPE (conform exactly)

{
  organizationId: string;
  websiteId: string;
  locale: string;
  url: string;
  slices: ({
    type: "description";
    content: string;
  } | {
    type: "text";
    content: string;
  } | {
    type: "heading";
    content: string;
    level?: 2 | 3;
  } | {
    type: "list";
    content: {
      ordered?: boolean;
      items: {
        text: string;
      }[];
    };
  } | {
    type: "image";
    content: {
      src: string;
      alt: string;
    };
  } | {
    type: "faq";
    content: {
      question: string;
      answer: string;
    }[];
  } | {
    type: "space";
  } | {
    type: "related";
    content: string[];
  })[];
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    schemas: ({
      type: "article";
      title: string;
      description: string;
      date: string;
      readingTime: number;
      keywords: string[];
    } | {
      type: "person";
      name: string;
      jobTitle?: string;
      description?: string;
      url?: string;
      sameAs?: string[];
    } | {
      type: "product";
      name: string;
      description?: string;
      brand?: string;
      price?: number;
      priceCurrency?: string;
      availability?: "InStock" | "OutOfStock" | "PreOrder";
    })[];
  };
}

## FIELD RULES

- organizationId: always ""
- websiteId: always ""
- Do NOT include "pageId" — the key must not exist in the output at all
- locale: exact ISO 639-1 code from request
- url: starts with /, lowercase, hyphens, no accents/spaces, must not match any existingPages URL

## SLICES

Only use slice types that improve the page. Do not force all types.

A typical structure: description → heading → text → list → more heading/text sections → faq → related.

### description

Page introduction. content is an HTML string.

{"type": "description", "content": "<p>Introduction text here.</p>"}

### text

Body content. content is an HTML string. Use <p>, <strong>, <em>, <ul>, <ol>, <li>, <a>. No markdown inside HTML.

{"type": "text", "content": "<p>First paragraph.</p><p>Second with <a href='/other-page'>a link</a> and <strong>bold</strong>.</p>"}

### heading

Section title. content is plain text (not HTML). level: 2 for sections, 3 for subsections. Never level 1.

{"type": "heading", "content": "Why does this happen?", "level": 2}

### list

Multiple related items. Each item has a text property (may contain HTML). Use ordered: true for sequential steps, false for unordered.

{"type": "list", "content": {"ordered": true, "items": [{"text": "<p><strong>Step 1:</strong> Explanation.</p>"}, {"text": "<p><strong>Step 2:</strong> Explanation.</p>"}]}}

### image

Only use when a real image URL is explicitly provided. Never invent image URLs. If no reliable source, do not generate this slice.

{"type": "image", "content": {"src": "https://real-url.com/img.jpg", "alt": "Photo description"}}

### faq

Questions and answers. Use when the topic genuinely benefits from FAQ format.

{"type": "faq", "content": [{"question": "Question?", "answer": "Answer."}]}

### space

Visual separator. Use sparingly.

{"type": "space"}

### related

URLs of topically related pages from existingPages. Only use URLs that exist. Never invent URLs.

{"type": "related", "content": ["/existing-page-url"]}

### Internal linking

When relevant, add <a> links in HTML content using URLs from existingPages only. Do not invent URLs or force links.

## SEO

Always generate seo with title, description, and schemas array.
- keywords: optional, include when naturally relevant, no keyword stuffing.
- schemas: only include types that genuinely correspond to page content.
  - article: title, description, date (ISO), readingTime (integer minutes), keywords.
  - person: only include known properties. Never invent job titles, URLs, social profiles.
  - product: only include known properties. Never invent prices, brands, availability.

## CONTENT QUALITY

- Coherent, well-structured, publication-ready
- Directly answers user's request with enough detail to be useful
- No unsupported claims or fabricated details
- Natural language appropriate for requested locale

## VALIDATION

Before returning, verify:
- Exactly one JSON object, no surrounding text or fences
- All HTML attributes inside strings use escaped quotes (\\")
- No trailing commas, comments, or JS expressions
- "pageId" does not exist anywhere in output
- organizationId and websiteId are ""
- url starts with / and is not in existingPages
- All slices use valid types with correct structure
- Heading levels are 2 or 3 only
- SEO has title, description, schemas
- All content in requested language
- JSON is syntactically valid

Return the JSON now.
`;

export default function getPrompt(
  locale: Cms.Locales[number],
  prompt: string,
  existingPages: {
    url: string;
    title: string;
    description: string;
  }[],
) {
  return message
    .replace("{LOCALE}", locale)
    .replace("{PROMPT}", prompt)
    .replace("{EXISTING_PAGES}", JSON.stringify(existingPages));
}
