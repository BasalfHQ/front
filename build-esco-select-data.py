#!/usr/bin/env python3
"""
Build occupation-only ESCO select data for apps/slot/public/esco/.
Filters out skill categories — only keeps categories that lead to occupations.
"""

import json
import os
from collections import defaultdict

with open("esco-clean.json") as f:
    data = json.load(f)

cat_by_id = {c["id"]: c for c in data["categories"]}
occ_by_id = {o["id"]: o for o in data["occupations"]}
cat_ids = set(cat_by_id)
occ_ids = set(occ_by_id)

# Find all categories that are ancestors of occupations
relevant_cats = set()

def collect_ancestors(entry_id):
    current = entry_id
    visited = set()
    while current and current not in visited:
        visited.add(current)
        if current in cat_ids:
            relevant_cats.add(current)
        entry = occ_by_id.get(current) or cat_by_id.get(current)
        if entry:
            current = entry.get("broader")
        else:
            break

for o in data["occupations"]:
    if o.get("broader"):
        collect_ancestors(o["broader"])

print(f"Total categories: {len(cat_ids)}")
print(f"Occupation-relevant categories: {len(relevant_cats)}")

# Build children map (only relevant nodes)
children = defaultdict(list)

for cid in relevant_cats:
    cat = cat_by_id[cid]
    parent = cat.get("broader")
    if parent and parent in relevant_cats:
        children[parent].append({"id": cid, "type": "category"})
    elif not parent or parent not in relevant_cats:
        children["ROOT"].append({"id": cid, "type": "category"})

for o in data["occupations"]:
    parent = o.get("broader")
    if parent:
        children[parent].append({"id": o["id"], "type": "occupation"})

# Sort ROOT by code
root_items = children.get("ROOT", [])
root_items.sort(key=lambda x: cat_by_id.get(x["id"], {}).get("code", ""))
children["ROOT"] = root_items

# Collect all relevant IDs for labels
relevant_ids = relevant_cats | occ_ids

# Output directory
out_dir = "apps/slot/public/esco"
os.makedirs(f"{out_dir}/labels", exist_ok=True)

# Write children.json
with open(f"{out_dir}/children.json", "w") as f:
    json.dump(dict(children), f, ensure_ascii=False)

# Write labels per language (only relevant IDs)
all_langs = set()
for c in data["categories"]:
    if c["id"] in relevant_ids:
        all_langs.update(c.get("labels", {}).keys())
for o in data["occupations"]:
    all_langs.update(o.get("labels", {}).keys())

for lang in sorted(all_langs):
    labels = {}
    for cid in relevant_cats:
        cat = cat_by_id[cid]
        if lang in cat.get("labels", {}):
            labels[cid] = cat["labels"][lang]
    for o in data["occupations"]:
        if lang in o.get("labels", {}):
            labels[o["id"]] = o["labels"][lang]
    with open(f"{out_dir}/labels/{lang}.json", "w") as f:
        json.dump(labels, f, ensure_ascii=False)

# Report
print(f"\nROOT items: {len(children['ROOT'])}")
for item in children["ROOT"]:
    cat = cat_by_id[item["id"]]
    print(f"  [{cat.get('code', '?')}] {cat['labels'].get('en', '?')}")

print(f"\nFiles written to {out_dir}/")
total_size = 0
for root, dirs, files in os.walk(out_dir):
    for fname in files:
        fpath = os.path.join(root, fname)
        size = os.path.getsize(fpath)
        total_size += size
print(f"  children.json: {os.path.getsize(f'{out_dir}/children.json') / 1024:.0f}KB")
print(f"  labels/: {len(all_langs)} languages")
print(f"  Total: {total_size / 1024:.0f}KB")
