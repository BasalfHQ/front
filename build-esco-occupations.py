#!/usr/bin/env python3
"""
Build two clean JSONs from esco-clean.json:
1. esco-occupations.json — flat list of all occupations with translations
2. esco-categories.json — categories with their occupations nested inside
"""

import json

with open("esco-clean.json") as f:
    data = json.load(f)

cat_by_id = {c["id"]: c for c in data["categories"]}
occ_by_id = {o["id"]: o for o in data["occupations"]}
cat_ids = set(cat_by_id.keys())


def find_category_id(entry_id, visited=None):
    if visited is None:
        visited = set()
    if entry_id in visited:
        return None
    visited.add(entry_id)
    if entry_id in cat_ids:
        return entry_id
    occ = occ_by_id.get(entry_id)
    if occ and occ.get("broader"):
        return find_category_id(occ["broader"], visited)
    return None


# --- 1. esco-occupations.json ---
occupations = []
for o in data["occupations"]:
    cat_id = find_category_id(o["broader"]) if o.get("broader") else None
    cat = cat_by_id.get(cat_id) if cat_id else None

    occupations.append({
        "id": o["id"],
        "code": o.get("code"),
        "labels": o["labels"],
        "altLabels": o["altLabels"],
        "categoryId": cat_id,
        "categoryCode": cat["code"] if cat else None,
        "categoryLabels": cat["labels"] if cat else None,
    })

with open("esco-occupations.json", "w") as f:
    json.dump({
        "meta": {"count": len(occupations), "source": "ESCO v1.2.1"},
        "occupations": occupations,
    }, f, ensure_ascii=False, indent=2)

print(f"esco-occupations.json: {len(occupations)} occupations")


# --- 2. esco-categories.json ---
# Build category tree with occupations nested
cat_occupations = {}
for o in occupations:
    cid = o["categoryId"]
    if cid:
        if cid not in cat_occupations:
            cat_occupations[cid] = []
        cat_occupations[cid].append({
            "id": o["id"],
            "code": o["code"],
            "labels": o["labels"],
            "altLabels": o["altLabels"],
        })

# Build parent chain for categories
def get_ancestors(cat_id):
    chain = []
    visited = set()
    current = cat_id
    while current and current not in visited:
        visited.add(current)
        cat = cat_by_id.get(current)
        if not cat:
            break
        parent = cat.get("broader")
        if parent and parent in cat_by_id:
            chain.append(parent)
            current = parent
        else:
            break
    return chain

categories = []
for c in data["categories"]:
    cid = c["id"]
    ancestors = get_ancestors(cid)

    categories.append({
        "id": cid,
        "code": c.get("code"),
        "labels": c["labels"],
        "parentId": c.get("broader") if c.get("broader") in cat_ids else None,
        "ancestors": ancestors,
        "occupations": cat_occupations.get(cid, []),
    })

with open("esco-categories.json", "w") as f:
    json.dump({
        "meta": {
            "totalCategories": len(categories),
            "totalOccupations": sum(len(c["occupations"]) for c in categories),
            "source": "ESCO v1.2.1",
        },
        "categories": categories,
    }, f, ensure_ascii=False, indent=2)

cats_with_occ = sum(1 for c in categories if c["occupations"])
print(f"esco-categories.json: {len(categories)} categories ({cats_with_occ} with occupations)")

# Size report
import os
for fname in ["esco-occupations.json", "esco-categories.json"]:
    size = os.path.getsize(fname) / 1024 / 1024
    print(f"  {fname}: {size:.1f}MB")
