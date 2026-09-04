#!/usr/bin/env python3
"""
Extract clean occupations, skills, and categories from ESCO JSON-LD.
Drops all noise (associations, URIs, label metadata, schemes).
Output: esco-clean.json
"""

import json
import sys
from collections import defaultdict

INPUT = "esco-v1.2.1.json-ld"
OUTPUT = "esco-clean.json"


def extract_translations(label_data):
    """Pull {lang: text} from preferredLabel or alternativeLabel entries."""
    if not label_data:
        return {}
    if isinstance(label_data, dict):
        label_data = [label_data]
    translations = {}
    for entry in label_data:
        literal = entry.get("literalForm", {})
        if isinstance(literal, dict):
            translations.update(literal)
    return translations


def extract_alt_translations(label_data):
    """Pull alternativeLabel translations grouped by language."""
    if not label_data:
        return {}
    if isinstance(label_data, dict):
        label_data = [label_data]
    by_lang = defaultdict(list)
    for entry in label_data:
        literal = entry.get("literalForm", {})
        if isinstance(literal, dict):
            for lang, text in literal.items():
                by_lang[lang].append(text)
    return dict(by_lang)


def get_id(uri):
    """Extract short ID from URI."""
    if not uri:
        return None
    if isinstance(uri, list):
        uri = uri[0]
    return uri.rsplit("/", 1)[-1] if "/" in uri else uri


def get_types(item):
    """Get type list."""
    t = item.get("type", [])
    if isinstance(t, str):
        t = [t]
    return t


def main():
    print(f"Loading {INPUT}...")
    with open(INPUT) as f:
        data = json.load(f)

    graph = data["@graph"]
    print(f"Total graph entries: {len(graph)}")

    occupations = []
    skills = []
    categories = {}  # uri -> category

    for item in graph:
        types = get_types(item)
        uri = item.get("uri", "")

        if "esco:Occupation" in types:
            broader_uri = item.get("broader", "")
            if isinstance(broader_uri, list):
                broader_uri = broader_uri[0] if broader_uri else ""

            occupations.append({
                "id": get_id(uri),
                "type": "occupation",
                "labels": extract_translations(item.get("preferredLabel")),
                "altLabels": extract_alt_translations(item.get("alternativeLabel")),
                "broader": get_id(broader_uri) if broader_uri else None,
                "code": item.get("notation", None),
            })

        elif "esco:Skill" in types:
            skill_type_uri = item.get("skillType", "")
            skill_type = skill_type_uri.rsplit("/", 1)[-1] if "/" in str(skill_type_uri) else str(skill_type_uri)

            broader_raw = item.get("broader", [])
            if isinstance(broader_raw, str):
                broader_raw = [broader_raw]

            skills.append({
                "id": get_id(uri),
                "type": "skill",
                "skillType": skill_type,
                "labels": extract_translations(item.get("preferredLabel")),
                "altLabels": extract_alt_translations(item.get("alternativeLabel")),
                "broader": [get_id(b) for b in broader_raw] if broader_raw else [],
            })

        elif types == ["skos:Concept"] or (
            "skos:Concept" in types
            and "esco:Occupation" not in types
            and "esco:Skill" not in types
            and "esco:LabelRole" not in types
        ):
            notation = item.get("notation", None)
            narrower = item.get("narrower", [])
            if isinstance(narrower, str):
                narrower = [narrower]

            broader_raw = item.get("broader", "")
            if isinstance(broader_raw, list):
                broader_raw = broader_raw[0] if broader_raw else ""

            categories[uri] = {
                "id": get_id(uri),
                "type": "category",
                "code": notation,
                "labels": extract_translations(item.get("preferredLabel")),
                "broader": get_id(broader_raw) if broader_raw else None,
                "children": [get_id(n) for n in narrower],
            }

    result = {
        "meta": {
            "source": "ESCO v1.2.1",
            "occupations": len(occupations),
            "skills": len(skills),
            "categories": len(categories),
        },
        "categories": list(categories.values()),
        "occupations": occupations,
        "skills": skills,
    }

    print(f"Writing {OUTPUT}...")
    with open(OUTPUT, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    original_size = len(open(INPUT).read())
    output_size = len(open(OUTPUT).read())
    print(f"\nDone!")
    print(f"  Occupations: {len(occupations)}")
    print(f"  Skills:      {len(skills)}")
    print(f"  Categories:  {len(categories)}")
    print(f"  Size: {original_size/1024/1024:.1f}MB -> {output_size/1024/1024:.1f}MB ({100-output_size/original_size*100:.0f}% reduction)")


if __name__ == "__main__":
    main()
