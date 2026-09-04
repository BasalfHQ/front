#!/usr/bin/env python3
"""
Build clean ESCO files in esco/ folder:
  - tree.json          — ID-only tree (cats -> cats/occs, occs -> occs)
  - cat-translations.json  — lang -> catId -> label
  - occ-translations.json  — lang -> occId -> label
  - occupations.json   — flat list with metadata (no translations, just IDs + codes)
  - clean.json         — moved from esco-clean.json
"""

import json
import os
from collections import defaultdict

with open("esco-clean.json") as f:
    data = json.load(f)

cat_by_id = {c["id"]: c for c in data["categories"]}
occ_by_id = {o["id"]: o for o in data["occupations"]}
cat_ids = set(cat_by_id.keys())
occ_ids = set(occ_by_id.keys())

os.makedirs("esco", exist_ok=True)

# --- tree.json ---
# Build using broader relationships (bottom-up)
# Category children: other categories
cat_children = defaultdict(list)
for c in data["categories"]:
    parent = c.get("broader")
    if parent and parent in cat_ids:
        cat_children[parent].append(c["id"])

# Occupation children of categories and occupations
occ_children_of_cat = defaultdict(list)
occ_children_of_occ = defaultdict(list)
for o in data["occupations"]:
    parent = o.get("broader")
    if not parent:
        continue
    if parent in cat_ids:
        occ_children_of_cat[parent].append(o["id"])
    elif parent in occ_ids:
        occ_children_of_occ[parent].append(o["id"])

def build_occ_node(occ_id):
    node = {"id": occ_id, "type": "occupation"}
    children = occ_children_of_occ.get(occ_id, [])
    if children:
        node["children"] = [build_occ_node(ch) for ch in children]
    return node

def build_cat_node(cat_id):
    cat = cat_by_id[cat_id]
    node = {"id": cat_id, "type": "category"}
    if cat.get("code"):
        node["code"] = cat["code"]

    children = []
    for ch in cat_children.get(cat_id, []):
        children.append(build_cat_node(ch))
    for oid in occ_children_of_cat.get(cat_id, []):
        children.append(build_occ_node(oid))

    if children:
        node["children"] = children
    return node

# Find root categories (no parent in cat_ids)
roots = [c["id"] for c in data["categories"]
         if not c.get("broader") or c["broader"] not in cat_ids]

tree = [build_cat_node(r) for r in roots]

with open("esco/tree.json", "w") as f:
    json.dump(tree, f, ensure_ascii=False, indent=2)
print(f"esco/tree.json: {len(roots)} roots")


# --- cat-translations.json ---
# { lang: { catId: label } }
cat_trans = defaultdict(dict)
for c in data["categories"]:
    for lang, label in c.get("labels", {}).items():
        cat_trans[lang][c["id"]] = label

with open("esco/cat-translations.json", "w") as f:
    json.dump(dict(cat_trans), f, ensure_ascii=False, indent=2)
print(f"esco/cat-translations.json: {len(cat_trans)} languages")


# --- occ-translations.json ---
# { lang: { occId: label } }
occ_trans = defaultdict(dict)
for o in data["occupations"]:
    for lang, label in o.get("labels", {}).items():
        occ_trans[lang][o["id"]] = label

with open("esco/occ-translations.json", "w") as f:
    json.dump(dict(occ_trans), f, ensure_ascii=False, indent=2)
print(f"esco/occ-translations.json: {len(occ_trans)} languages")


# --- occupations.json ---
# Flat list: id, code, altLabels (kept because useful for search)
occupations = []
for o in data["occupations"]:
    entry = {"id": o["id"]}
    if o.get("code"):
        entry["code"] = o["code"]
    if o.get("altLabels"):
        entry["altLabels"] = o["altLabels"]
    occupations.append(entry)

with open("esco/occupations.json", "w") as f:
    json.dump(occupations, f, ensure_ascii=False, indent=2)
print(f"esco/occupations.json: {len(occupations)} occupations")


# Size report
print("\nFile sizes:")
for fname in os.listdir("esco"):
    size = os.path.getsize(f"esco/{fname}") / 1024 / 1024
    print(f"  {fname}: {size:.1f}MB")
