import type { CmsPage } from "@basalf/cms-next";

// Dev-only CMS pages, used when NEXT_PUBLIC_STAGE=dev and no BASALF_DEV_BOOK_CMS_TOKEN
// is set — see ./content.ts.
function page(
  locale: string,
  url: string,
  seo: { title: string; description: string },
  slices: CmsPage["slices"],
): CmsPage {
  return {
    pageId: `dev-${locale}${url.replaceAll("/", "-")}`,
    locale,
    url,
    seo: {
      ...seo,
      schemas: url.split("/").length > 2
        ? [
            {
              type: "article",
              title: seo.title,
              description: seo.description,
              date: "2026-09-24",
              readingTime: 3,
              keywords: [],
            },
          ]
        : [],
    },
    slices,
  };
}

export const devOccupationPages: CmsPage[] = [
  page(
    "en",
    "/barber/reduce-no-shows",
    {
      title: "How barbers can cut no-shows with online booking",
      description:
        "Why clients skip barber appointments, and the simple habits — confirmation emails, clear services, easy rescheduling — that keep your chair full.",
    },
    [
      { type: "heading", content: "Why clients don't show up", level: 2 },
      {
        type: "text",
        content:
          "<p>Most no-shows aren't rude: the client forgot, or couldn't reach you to move the appointment. Online booking fixes both — a confirmation email right away, and a booking page they can come back to.</p>",
      },
      {
        type: "faq",
        content: [
          {
            question: "Do clients get a confirmation?",
            answer:
              "<p>Yes: every booking sends the client a confirmation email.</p>",
          },
        ],
      },
      { type: "related", content: ["/barber"] },
    ],
  ),
  page(
    "en",
    "/barber",
    {
      title: "Online booking for barbers — 5 €/month | Book",
      description:
        "Your clients pick a cut and a time, you get the booking. Online booking for barbers: really simple, 5 €/month, everything included.",
    },
    [
      {
        type: "description",
        content:
          "<p>Your clients pick a cut and a time. You get the booking. No phone tag between two fades.</p>",
      },
      {
        type: "table",
        content: {
          headers: ["Service", "Duration", "Price"],
          rows: [
            ["Haircut", "30 min", "25 €"],
            ["Beard trim", "20 min", "15 €"],
            ["Hot towel shave", "30 min", "25 €"],
            ["Kids' cut", "20 min", "18 €"],
          ],
        },
      },
      {
        type: "heading",
        content: "Why barbers move to online booking",
      },
      {
        type: "text",
        content:
          "<p>Most barbers take bookings between two cuts: a call picked up with clippers in hand, a DM answered at night. Online booking moves that to your booking page — clients see your services, prices and free slots, and book on their own.</p>",
      },
      {
        type: "list",
        content: {
          items: [
            { text: "Fewer calls during cuts" },
            { text: "Bookings come in after closing time" },
            { text: "Every booking lands in your calendar" },
          ],
        },
      },
      {
        type: "faq",
        content: [
          {
            question: "Can clients choose between a haircut and a beard trim?",
            answer:
              "<p>Yes. Add as many services as you offer. Each has its own price and duration, and the client picks one when booking.</p>",
          },
          {
            question: "Do my clients need an account?",
            answer:
              "<p>No. They enter their name, email and phone, and that's it. They get a confirmation email.</p>",
          },
          {
            question: "What about walk-ins?",
            answer:
              "<p>Keep taking them. Book a walk-in or a phone call yourself in the calendar, so the slot is gone online too.</p>",
          },
          {
            question: "Do you take a cut on each booking?",
            answer:
              "<p>Never. 5 € a month, whether you do ten cuts or three hundred.</p>",
          },
        ],
      },
    ],
  ),
  page(
    "fr",
    "/barber",
    {
      title: "Logiciel de réservation pour barbiers — 5 €/mois | Book",
      description:
        "Vos clients choisissent une coupe et un horaire, vous recevez la réservation. La réservation en ligne pour barbiers : vraiment simple, 5 €/mois, tout compris.",
    },
    [
      {
        type: "description",
        content:
          "<p>Vos clients choisissent une coupe et un horaire. Vous recevez la réservation. Fini le téléphone qui sonne entre deux dégradés.</p>",
      },
      {
        type: "table",
        content: {
          headers: ["Prestation", "Durée", "Prix"],
          rows: [
            ["Coupe homme", "30 min", "25 €"],
            ["Taille de barbe", "20 min", "15 €"],
            ["Rasage à l'ancienne", "30 min", "25 €"],
            ["Coupe enfant", "20 min", "18 €"],
          ],
        },
      },
      {
        type: "faq",
        content: [
          {
            question:
              "Mes clients peuvent-ils choisir entre une coupe et une taille de barbe ?",
            answer:
              "<p>Oui. Ajoutez toutes les prestations que vous proposez. Chacune a son prix et sa durée, et le client choisit au moment de réserver.</p>",
          },
          {
            question: "Mes clients doivent-ils créer un compte ?",
            answer:
              "<p>Non. Ils indiquent leur nom, leur e-mail et leur téléphone, c'est tout. Ils reçoivent un e-mail de confirmation.</p>",
          },
          {
            question: "Et les clients de passage ?",
            answer:
              "<p>Continuez à les accueillir. Réservez vous-même un client de passage ou un appel dans le calendrier : le créneau disparaît aussi en ligne.</p>",
          },
          {
            question: "Prenez-vous une commission sur les réservations ?",
            answer:
              "<p>Jamais. 5 € par mois, que vous fassiez dix coupes ou trois cents.</p>",
          },
        ],
      },
    ],
  ),
  page(
    "en",
    "/beauty-wellness",
    {
      title: "Online booking for beauty & wellness pros — 5 €/month | Book",
      description:
        "Hair, nails, massage, spa: clients pick a treatment and a time on your own booking page. Really simple, 5 €/month, everything included.",
    },
    [
      {
        type: "description",
        content:
          "<p>Hair, nails, massage or spa: your clients pick a treatment and a time. You get the booking, without picking up the phone mid-treatment.</p>",
      },
      {
        type: "table",
        content: {
          headers: ["Service", "Duration", "Price"],
          rows: [
            ["Haircut", "30 min", "25 €"],
            ["Manicure", "45 min", "30 €"],
            ["Relaxing massage", "60 min", "60 €"],
            ["Make-up", "45 min", "40 €"],
          ],
        },
      },
      {
        type: "heading",
        content: "How beauty & wellness pros take bookings today",
      },
      {
        type: "text",
        content:
          "<p>Treatments are long and your hands are busy: calls go to voicemail, DMs pile up. A booking page answers for you, with each treatment's price and duration.</p>",
      },
      {
        type: "faq",
        content: [
          {
            question: "I offer treatments of very different lengths. Does it work?",
            answer:
              "<p>Yes. Each service has its own duration and price, from a 20-minute trim to a 2-hour spa ritual.</p>",
          },
        ],
      },
    ],
  ),
  page(
    "en",
    "/beauty-wellness/pricing-your-treatments",
    {
      title: "How to price your beauty treatments",
      description:
        "Duration, products, local prices: a simple way to set prices for your treatments and show them on your booking page.",
    },
    [
      { type: "heading", content: "Start from your time", level: 2 },
      {
        type: "text",
        content:
          "<p>Price each treatment from its duration first, then add the cost of the products you use.</p>",
      },
      { type: "related", content: ["/beauty-wellness", "/barber"] },
    ],
  ),
  // Never live: category article slugs can't be occupation slugs.
  page(
    "en",
    "/beauty-wellness/hairdresser",
    { title: "Shadowed by the hairdresser page", description: "" },
    [],
  ),
];
