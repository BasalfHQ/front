#!/usr/bin/env python3
"""
Build booking-relevant occupations from ESCO data.
Outputs apps/slot/public/esco/booking-occupations.json with custom categories.
"""

import json
import os

with open("esco-clean.json") as f:
    data = json.load(f)

occ_by_id = {o["id"]: o for o in data["occupations"]}

en_labels = {}
for o in data["occupations"]:
    if "en" in o.get("labels", {}):
        en_labels[o["id"]] = o["labels"]["en"].lower()

def exact(label):
    label_l = label.lower()
    for oid, l in en_labels.items():
        if l == label_l:
            return oid
    print(f"  WARNING: not found: '{label}'")
    return None

def exact_ids(*labels):
    results = set()
    for label in labels:
        oid = exact(label)
        if oid:
            results.add(oid)
    return results

categories = []

# --- Health & Medical ---
health = exact_ids(
    "acupuncturist",
    "audiologist",
    "chiropractor",
    "specialist chiropractor",
    "clinical psychologist",
    "assistant clinical psychologist",
    "dental hygienist",
    "dietitian",
    "general practitioner",
    "homeopath",
    "kinesiologist",
    "midwife",
    "nurse responsible for general care",
    "specialist nurse",
    "occupational therapist",
    "optician",
    "optometrist",
    "orthoptist",
    "osteopath",
    "pharmacist",
    "phlebotomist",
    "physiotherapist",
    "physiotherapy assistant",
    "podiatrist",
    "podiatry assistant",
    "prosthetist-orthotist",
    "psychologist",
    "psychotherapist",
    "radiographer",
    "sophrologist",
    "specialist dentist",
    "specialised doctor",
    "speech and language therapist",
    "sport therapist",
    "traditional chinese medicine therapist",
    "rehabilitation support worker",
    "recreational therapist",
    "radiation therapist",
)
categories.append(("Health & Medical", "Santé & Médical", health))

# --- Beauty & Wellness ---
beauty = exact_ids(
    "barber",
    "beauty salon attendant",
    "beauty salon manager",
    "body artist",
    "hairdresser",
    "hairdresser assistant",
    "make-up artist",
    "manicurist",
    "massage therapist",
    "pedicurist",
    "performance hairdresser",
    "personal stylist",
    "spa attendant",
    "spa manager",
    "tanning consultant",
    "wig and hairpiece maker",
    "aromatherapist",
    "shiatsu practitioner",
)
categories.append(("Beauty & Wellness", "Beauté & Bien-être", beauty))

# --- Fitness & Sport ---
fitness = exact_ids(
    "boxing instructor",
    "football coach",
    "golf instructor",
    "horse riding instructor",
    "ice-skating coach",
    "outdoor activities instructor",
    "personal trainer",
    "pilates teacher",
    "ski instructor",
    "snowboard instructor",
    "sports coach",
    "sports instructor",
    "swimming teacher",
    "tennis coach",
    "specialised outdoor animator",
    "survival instructor",
)
categories.append(("Fitness & Sport", "Fitness & Sport", fitness))

# --- Education & Tutoring ---
education = exact_ids(
    "tutor",
    "sign language teacher",
    "car driving instructor",
    "driving instructor",
    "truck driving instructor",
    "photography teacher",
    "performing arts school dance instructor",
    "performing arts theatre instructor",
    "music therapist",
    "art therapist",
)
categories.append(("Education & Tutoring", "Éducation & Cours", education))

# --- Legal & Financial ---
legal = exact_ids(
    "accountant",
    "financial auditor",
    "financial adviser",
    "financial planner",
    "insurance broker",
    "lawyer",
    "notary",
    "tax advisor",
    "mediator",
    "immigration adviser",
    "credit adviser",
    "investment adviser",
)
categories.append(("Legal & Financial", "Juridique & Finance", legal))

# --- Home Services ---
home = exact_ids(
    "bricklayer",
    "carpenter",
    "chimney sweep",
    "construction painter",
    "domestic housekeeper",
    "electrician",
    "hardwood floor layer",
    "landscape gardener",
    "locksmith",
    "paperhanger",
    "pest management worker",
    "plasterer",
    "plate glass installer",
    "plumber",
    "resilient floor layer",
    "roofer",
    "smart home installer",
    "sprinkler fitter",
    "stonemason",
    "tile fitter",
    "tree surgeon",
    "upholsterer",
    "window cleaner",
    "window installer",
    "refrigeration air condition and heat pump technician",
)
categories.append(("Home Services", "Services à domicile", home))

# --- Consulting & Coaching ---
consulting = exact_ids(
    "career guidance advisor",
    "life coach",
    "public speaking coach",
    "weight loss consultant",
    "renewable energy consultant",
    "smart city consultant",
    "security consultant",
)
categories.append(("Consulting & Coaching", "Conseil & Coaching", consulting))

# --- Pet Services ---
pets = exact_ids(
    "animal groomer",
    "dog trainer",
    "pet sitter",
    "veterinary nurse",
    "specialised veterinarian",
    "animal therapist",
    "animal osteopath",
    "animal massage therapist",
)
categories.append(("Pet Services", "Services pour animaux", pets))

# --- Automotive ---
auto = exact_ids(
    "diesel engine mechanic",
    "motorcycle mechanic",
    "tyre fitter",
    "vehicle technician",
    "vehicle maintenance attendant",
    "vehicle restoration technician",
    "roadside vehicle technician",
    "vehicle glazier",
    "vehicle electronics installer",
    "sports equipment repair technician",
)
categories.append(("Automotive", "Automobile", auto))

# --- Real Estate ---
realestate = exact_ids(
    "real estate agent",
    "property appraiser",
    "property assistant",
    "personal property appraiser",
)
categories.append(("Real Estate", "Immobilier", realestate))

# --- Creative & Media ---
creative = exact_ids(
    "photographer",
    "graphic designer",
    "interior designer",
    "web designer",
    "fashion designer",
    "jewellery designer",
    "illustrator",
    "sculptor",
    "ceramicist",
    "tailor",
    "dressmaker",
    "singer",
    "musician",
    "flower and garden specialised seller",
)
categories.append(("Creative & Media", "Créatif & Médias", creative))

# --- Events & Entertainment ---
events = exact_ids(
    "disc jockey",
    "wedding planner",
    "event manager",
    "event assistant",
    "stand-up comedian",
    "street performer",
    "performance artist",
    "hospitality entertainment manager",
)
categories.append(("Events & Entertainment", "Événements & Divertissement", events))

# --- Food & Hospitality ---
food = exact_ids(
    "chef",
    "head chef",
    "private chef",
    "sommelier",
    "wine sommelier",
    "beer sommelier",
    "bartender",
    "cocktail bartender",
    "pastry chef",
    "head pastry chef",
    "pizzaiolo",
    "baker",
    "butcher",
)
categories.append(("Food & Hospitality", "Alimentation & Restauration", food))

# --- Technology & IT ---
tech = exact_ids(
    "ICT help desk agent",
    "web developer",
    "software developer",
    "database administrator",
)
categories.append(("Technology & IT", "Technologie & IT", tech))

# --- Other Services ---
other = exact_ids(
    "translator",
    "interpreter",
    "sign language interpreter",
    "private detective",
    "personal shopper",
    "psychic",
    "astrologer",
    "fortune teller",
    "medium",
    "shoe repairer",
    "watch and clock repairer",
    "furniture restorer",
)
categories.append(("Other Services", "Autres services", other))

# === BUILD OUTPUT ===
seen = set()
output_categories = []
total = 0

for name_en, name_fr, occ_ids in categories:
    unique_ids = [oid for oid in sorted(occ_ids) if oid not in seen]
    seen.update(unique_ids)
    if not unique_ids:
        print(f"  EMPTY category: {name_en}")
        continue

    cat_occupations = []
    for oid in unique_ids:
        occ = occ_by_id.get(oid)
        if occ:
            cat_occupations.append({
                "id": oid,
                "labels": occ.get("labels", {}),
            })

    cat_occupations.sort(key=lambda x: x["labels"].get("en", "").lower())

    output_categories.append({
        "id": name_en.lower().replace(" & ", "-").replace(" ", "-"),
        "labels": {"en": name_en, "fr": name_fr},
        "occupations": cat_occupations,
    })
    total += len(cat_occupations)
    print(f"  {name_en}: {len(cat_occupations)} occupations")

output = {
    "meta": {
        "total_occupations": total,
        "total_categories": len(output_categories),
    },
    "categories": output_categories,
}

out_path = "apps/slot/public/esco/booking-occupations.json"
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w") as f:
    json.dump(output, f, ensure_ascii=False)

size_kb = os.path.getsize(out_path) / 1024
print(f"\nWrote {out_path}")
print(f"  {total} occupations in {len(output_categories)} categories")
print(f"  Size: {size_kb:.0f}KB")
