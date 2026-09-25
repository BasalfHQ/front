# Generates from data/booking-occupations.json:
# - data/occupation-slugs.json:  { locale: { slug: occupationId } }
# - data/category-slugs.json:    { locale: { slug: categoryId } }
# - data/occupation-labels.json: { locale: { occupationId: { one, other } } }
#   (clean singular + plural label, for copy like "Online booking for barbers")
# Run: python3 packages/esco/scripts/generate_occupation_slugs.py
import json
import re
import unicodedata
from pathlib import Path

# Keep in sync with @repo/i18n routing locales.
LOCALES = ["en", "fr"]

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Singular labels the rules below get wrong (typos, gendered pairs that
# aren't masculine/feminine of the same word...), keyed by occupation id.
SINGULAR_OVERRIDES: dict[str, dict[str, str]] = {
    "fr": {
        # "gouvernantes/intendants à domicile": ESCO label is already plural
        "6d50f735-dca9-4a02-96dc-e4310ed98ae2": "gouvernante à domicile",
        # "osthéopathe animalier": typo in ESCO
        "e81269d8-f301-4c82-9235-ba33ec9b0434": "ostéopathe animalier",
    },
}

# Plurals the rules below get wrong, keyed by the cleaned singular label.
PLURAL_OVERRIDES: dict[str, dict[str, str]] = {
    "en": {
        "midwife": "midwives",
        "nurse responsible for general care": "nurses responsible for general care",
        "medium": "mediums",
        "pizzaiolo": "pizzaiolos",
    },
    "fr": {
        "maïeuticien": "sages-femmes",
        "gouvernante à domicile": "gouvernantes et intendants à domicile",
        "hygiéniste dentaire": "hygiénistes dentaires",
        "auditeur comptable et financier": "auditeurs comptables et financiers",
        "wedding planner": "wedding planners",
        "développeur web": "développeurs web",
        "art thérapeute": "art-thérapeutes",
        "coach prise de parole en public": "coachs en prise de parole en public",
        "responsable évènement": "responsables évènementiels",
        "coiffeur spectacle": "coiffeurs de spectacle",
        "moniteur automobile": "moniteurs automobile",
        "vitrier automobile": "vitriers automobile",
        "technicien en réfrigération, climatisation et pompe à chaleur": "techniciens en réfrigération, climatisation et pompe à chaleur",
    },
}

# French: only the words before the first of these get pluralized
# ("professeur de danse" -> "professeurs de danse").
FR_HEAD_STOP = re.compile(r"\s(?:de|d’|d'|des|du|en|à|pour|par|-)\s?|,")


def slugify(label: str) -> str:
    """ "barbier/barbière" -> "barbier", "employé d’institut" -> "employe-d-institut" """
    text = unicodedata.normalize("NFKD", label.split("/")[0])
    text = "".join(c for c in text if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def clean_label(label: str) -> str:
    """ "barbier/barbière" -> "barbier" (generic masculine, like the slug) """
    return label.split("/")[0].strip()


def pluralize_en_word(word: str) -> str:
    if re.search(r"(s|x|z|ch|sh)$", word):
        return word + "es"
    if re.search(r"[^aeiou]y$", word):
        return word[:-1] + "ies"
    return word + "s"


def pluralize_en(label: str) -> str:
    """ "hair stylist" -> "hair stylists": English pluralizes the last word """
    head, _, last = label.rpartition(" ")
    return (head + " " if head else "") + pluralize_en_word(last)


def pluralize_fr_word(word: str) -> str:
    if re.search(r"[sxz]$", word):
        return word
    if re.search(r"(eau|eu)$", word):
        return word + "x"
    if word.endswith("al"):
        return word[:-2] + "aux"
    return word + "s"


def pluralize_fr(label: str) -> str:
    """ "masseur kinésithérapeute" -> "masseurs kinésithérapeutes" """
    match = FR_HEAD_STOP.search(label)
    head, tail = (label[: match.start()], label[match.start() :]) if match else (label, "")
    return " ".join(pluralize_fr_word(w) for w in head.split(" ")) + tail


PLURALIZERS = {"en": pluralize_en, "fr": pluralize_fr}


def occupation_labels(occupation: dict, locale: str) -> dict[str, str]:
    labels = occupation["labels"]
    one = SINGULAR_OVERRIDES.get(locale, {}).get(occupation["id"]) or clean_label(
        labels.get(locale) or labels["en"]
    )
    other = PLURAL_OVERRIDES[locale].get(one) or PLURALIZERS[locale](one)
    return {"one": one, "other": other}


def add_unique(slugs: dict[str, str], slug: str, id_: str, locale: str) -> None:
    if not slug:
        raise ValueError(f"Empty {locale} slug for {id_}")
    if slugs.get(slug, id_) != id_:
        raise ValueError(f'Duplicate {locale} slug "{slug}": {slugs[slug]} / {id_}')
    slugs[slug] = id_


def write(name: str, data: dict) -> None:
    (DATA_DIR / name).write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def main() -> None:
    categories = json.loads(
        (DATA_DIR / "booking-occupations.json").read_text(encoding="utf-8")
    )["categories"]

    occupation_slugs: dict[str, dict[str, str]] = {}
    category_slugs: dict[str, dict[str, str]] = {}
    labels: dict[str, dict[str, dict[str, str]]] = {}
    for locale in LOCALES:
        occupation_slugs[locale] = {}
        category_slugs[locale] = {}
        labels[locale] = {}
        for category in categories:
            # English slug = category id ("beauty-wellness"), others from the label.
            category_slug = (
                category["id"] if locale == "en" else slugify(category["labels"][locale])
            )
            add_unique(category_slugs[locale], category_slug, category["id"], locale)
            for occupation in category["occupations"]:
                label = occupation["labels"].get(locale) or occupation["labels"]["en"]
                add_unique(occupation_slugs[locale], slugify(label), occupation["id"], locale)
                labels[locale][occupation["id"]] = occupation_labels(occupation, locale)

    # /for/{category} and /for/{category}/{occupation} share the URL space
    # with the CMS urls ("/{enSlug}"): a category slug can never be an
    # occupation slug, in any locale.
    all_occupation_slugs = {s for slugs in occupation_slugs.values() for s in slugs}
    for locale in LOCALES:
        clash = all_occupation_slugs & category_slugs[locale].keys()
        if clash:
            raise ValueError(f"{locale} category slugs clash with occupation slugs: {clash}")

    write("occupation-slugs.json", occupation_slugs)
    write("category-slugs.json", category_slugs)
    write("occupation-labels.json", labels)
    print(", ".join(f"{l}: {len(occupation_slugs[l])}" for l in LOCALES))


if __name__ == "__main__":
    main()
