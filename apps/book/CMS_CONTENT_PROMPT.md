# Book B2B content — agent prompt

Give this whole file to the agent that writes the B2B pages of **Book** into the CMS. It runs from the `basalf` repo root with the Basalf CMS MCP tools (`list_pages`, `search_pages`, `get_page`, `create_page`, `update_page`).

---

You are writing **all** the B2B SEO content of Book (book.basalf.com, Basalf's online booking app for independent professionals), in `en` and `fr`:

- **Phase 1 — every landing page:** all 15 categories and all 197 occupations of `front/packages/esco/data/booking-occupations.json` = 212 landings × 2 locales = 424 CMS pages. None is optional.
- **Phase 2 — articles:** 2–3 per occupation, 1–2 per category, both locales.

Build everything, without stopping for review. The job is long and may be interrupted at any time (credits, context): you track your own progress so that a later run — you or another agent given this same prompt — resumes exactly where you stopped.

## Start of every run

1. Read `front/apps/book/PLAN.md` fully. Its sections "CMS content brief (SEO)", "Articles brief", "Signup CTA", "Indexing rule" and "Internal linking" are your rules; this prompt summarizes them and PLAN.md wins if they differ.
2. Call `list_pages`. It must only contain Book pages (landing urls listed below and articles under them). If it contains unrelated pages (e.g. Minesweeper articles), you are connected to the wrong website: **stop and tell the user**, write nothing.
3. Open your progress file `front/apps/book/CMS_PROGRESS.md`:
   - **Doesn't exist** → create it (format below) from the data files, listing all 212 landings.
   - **Exists** → resync it with `list_pages`: tick every url + locale that exists in the CMS but isn't ticked (a previous run may have stopped between creating a page and saving the file). Then continue from the first unticked item.

## Progress file — `front/apps/book/CMS_PROGRESS.md`

You own this file; keep it accurate, it is the only memory between runs.

- A **Status** block at the top: last updated (date + time), current phase, next item, pages created so far, and one line of notes for whoever resumes.
- **Phase 1:** one section per category, one table row per landing: CMS url · `en` · `fr` · public en path · public fr path. Category row first, then its occupations. Order categories and occupations by business value (trades that book appointments all day first: beauty, health, fitness, coaching, pets, tutoring…; roles that rarely take bookings themselves last).
- **Phase 2:** one table, one row per article (CMS url · `en` · `fr` · notes). Add a folder's articles as rows **before** writing them, so `related` slices can point to siblings.
- Marks: `[x]` created, `[ ]` to do, `[!]` failed or skipped + a short note.
- **Save the file after every single page you create.** Never batch the ticks. Update the Status block at least after each finished row.

## Working rules

- Strict order: phase 1 rows top to bottom (`en`, save, `fr`, save), then phase 2.
- Before creating a page, make sure it doesn't exist yet (`list_pages` result / `search_pages`). Never create a duplicate url + locale; if it exists, tick it and move on.
- A page fails (tool error, invalid input): retry once, then mark `[!]` with a note and continue.
- Stop only for the wrong-website case or if the tools keep failing. When you stop — finished or not — save the file with an accurate Status block and report: pages created this run, `[!]` items, next item.
- Changes take a few seconds to show on the site; never re-create a page because it isn't visible yet.

## What Book is (only claim this, nothing else)

- Your own public booking page: your services (each with its price and duration), your free slots; clients book in a few clicks, no account needed, confirmation email.
- Bookings list: reschedule/cancel, add walk-ins and phone bookings yourself. Calendar sync (Google, iPhone, Mac).
- Availability: open slots on a calendar, repeat them by day of week.
- **Price: €5/month** (fr: **5 €/mois**), everything included, unlimited bookings and services, no commission, no contract. Write the price exactly like that.
- Never: free trial, invented statistics, testimonials, ratings, features not listed here, "TTC/VAT".

## URL conventions (the CMS `url` field)

The CMS url is a locale-independent key: create the same url once per locale.

| Page | CMS url | Public URL |
|---|---|---|
| Category landing | `/{categoryEnSlug}` | `/for/{categorySlug}` |
| Occupation landing | `/{occupationEnSlug}` | `/for/{categorySlug}/{occupationSlug}` |
| Occupation article | `/{occupationEnSlug}/{article-slug}` | `/for/{categorySlug}/{occupationSlug}/{article-slug}` |
| Category article | `/{categoryEnSlug}/{article-slug}` | `/for/{categorySlug}/{article-slug}` |

- Data in `front/packages/esco/data/`: `booking-occupations.json` (categories → occupations, labels per locale), `occupation-slugs.json` and `category-slugs.json` (`{ locale: { slug: id } }`). CMS urls use the **`en`** slug; the public fr path uses the `fr` slugs (e.g. `/barber` → `/for/beauty-wellness/barber` and `/fr/for/beaute-bien-etre/barbier`).
- Article slugs: English, lowercase-kebab, the same in `en` and `fr`.
- **A category article slug must never be an occupation slug in any locale** (check the `en` and `fr` keys of `occupation-slugs.json`): the occupation always wins and the article would never be served.
- An article is only served if its landing exists in the same locale — never write an article before its landing.

## Landing pages (category and occupation)

- `seo.title` ≤ 60 chars, keyword first, brand last: "Online booking for barbers — €5/month | Book" / "Logiciel de réservation pour barbiers — 5 €/mois | Book". Unique per page.
- `seo.description` 140–160 chars: what clients can book + "€5/month, everything included" / "5 €/mois, tout compris". Unique per page.
- Slices, in this order:
  1. `description` — hero pitch, 1–2 sentences, a real pain point of that trade.
  2. `table` — headers `[Service, Duration, Price]` (fr: `[Prestation, Durée, Prix]`), 4–8 typical services with realistic market prices (en: "€25", fr: "25 €").
  3. Guide — one `heading` level 2 (becomes the section title), then `text` / `list` / `heading` level 3: 300–600 words specific to the trade (how clients book it today, no-shows, walk-ins, session lengths, seasonality…). Never reused between pages.
  4. `faq` — 4–6 questions a professional of that trade asks before signing up; answers 2–4 sentences, answer first.
- **Category landing:** pitched to the whole category ("Online booking for beauty & wellness pros"). The table mixes services from several of its trades; the guide covers what those trades share and where they differ, naming them. Never a copy of one occupation's page.
- **Occupations that rarely take bookings themselves** (employees like `spa-attendant`, `hairdresser-assistant`, hospital roles like `radiographer`, IT roles…): still write them, but honestly — pitch the realistic independent use (freelance sessions, private consultations, side business, home visits, training sessions) and never pretend the trade works in a way it doesn't. Only if there is truly no honest angle, mark `[!]` with a note instead of writing filler.

## Articles (phase 2)

- Each answers one real question a pro of that trade searches (no-shows, pricing a service, walk-ins, first clients, cancellations, seasonality…). 800–1500 words, answer in the first paragraph.
- `seo.title` = the question/answer, no "Book". `seo.schemas`: one `article` schema (date = today, readingTime in minutes, keywords).
- Slices: `heading` (2/3) + `text` + `list` / `table`, optional `faq`, **end with a `related` slice**: the landing url (e.g. `/barber`) + 1–2 sibling articles that already exist.
- Never a disguised landing page: don't target "booking software for {trade}" — that is the landing's keyword.
- Never the same article across trades with the trade name swapped: each one uses the trade's real specifics.

## Writing rules

- Write each locale natively; never translate one into the other. fr uses the generic masculine plural ("les barbiers").
- Rich text is HTML (`<p>`, `<strong>`, `<ul>`…). No invented image URLs, competitor prices, names, quotes or numbers.
- Internal links (`related` slices, links in HTML) only to CMS urls that already exist in that locale.
