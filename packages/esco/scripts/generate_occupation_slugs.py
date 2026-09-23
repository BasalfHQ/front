# Generates data/occupation-slugs.json: { locale: { slug: occupationId } }
# from data/booking-occupations.json.
# Run: python3 packages/esco/scripts/generate_occupation_slugs.py
import json
import re
import unicodedata
from pathlib import Path

# Keep in sync with @repo/i18n routing locales.
LOCALES = ["en", "fr"]

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def slugify(label: str) -> str:
    """ "barbier/barbière" -> "barbier", "employé d’institut" -> "employe-d-institut" """
    text = unicodedata.normalize("NFKD", label.split("/")[0])
    text = "".join(c for c in text if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def main() -> None:
    categories = json.loads(
        (DATA_DIR / "booking-occupations.json").read_text(encoding="utf-8")
    )["categories"]

    result: dict[str, dict[str, str]] = {}
    for locale in LOCALES:
        slugs: dict[str, str] = {}
        for category in categories:
            for occupation in category["occupations"]:
                labels = occupation["labels"]
                slug = slugify(labels.get(locale) or labels["en"])
                if not slug:
                    raise ValueError(f"Empty {locale} slug for {occupation['id']}")
                if slugs.get(slug, occupation["id"]) != occupation["id"]:
                    raise ValueError(
                        f'Duplicate {locale} slug "{slug}": '
                        f"{slugs[slug]} / {occupation['id']}"
                    )
                slugs[slug] = occupation["id"]
        result[locale] = slugs

    (DATA_DIR / "occupation-slugs.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(", ".join(f"{l}: {len(result[l])}" for l in LOCALES))


if __name__ == "__main__":
    main()
