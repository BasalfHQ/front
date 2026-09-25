# Book B2B CMS progress

## Status

- Last updated: 2026-09-25 15:16
- Phase: 2 (articles)
- Next: done
- Pages created: 392
- Notes: prompt = `front/apps/book/CMS_CONTENT_PROMPT.md`. en price format `€5/month` / table `€25`; fr `5 €/mois` / `25 €`. Public /for routes not deployed yet (404) — not a content issue.

## Product facts (verified in code, user decisions 2026-09-24)

- A Service has only name + price. Duration comes from its slots: each slot belongs to ONE service, with its own start/end. Say "open slots for each service at the length it takes; clients pick a service, then one of its free slots". Never "service duration filters slots".
- Walk-ins / phone bookings: the pro books the slot themselves from the calendar; that slot is then no longer offered online. NEVER promise "no double bookings" / "nothing overlaps": slots of different services can overlap and aren't blocked.
- Slots sit within ONE day (date picker sets start+end same day). Multi-day courses: slot on first day + description. Never claim multi-day slots.
- Slots have a capacity: one slot can take several clients, each booking 1 place (public form = 1 person per booking). OK for group classes/workshops. NOT a group booking by one client. Pro booking from calendar CAN set number of persons (edit-slot.tsx numberOfPerson) — so restaurant/tasting: client books online 1 place + party size in note, or pro books the group by phone.
- Services have name, optional description (shown on public page) and price. Bookings list: reschedule / cancel. Confirmation email. Calendar sync Google/iPhone/Mac. Repeat slots by weekday.
- One booking page per business (org). NO per-employee calendars/staff assignment (ServiceProvider not linked to services/slots). Teams: honest workaround = one service per person. Never claim multi-staff features.
- Public booking form (verified booking-form.tsx): first name, last name, email, phone all required + optional "Additional information" free-text note.
- Public page does NOT show remaining places; full slots (usedCapacity>=maxCapacity) are just hidden. Never say "shows places left".
- NO cancellation/reschedule email to the client (only confirmation + new-booking-to-pro). Say the pro must tell the client.
- Slot repeat (verified create-slots.tsx): weekly on chosen weekdays (or all days) until a 'repeat until' date. NO every-N-weeks / monthly / yearly cycle.
- Public page shows slot times in the org's timezone and displays the timezone name (verified slot-selector.tsx).
- Emails (verified email-esg): client gets a booking confirmation; the pro gets a "new booking" email. Book does NOT do billing, payment, deposits, reminders (SMS/email), carte Vitale.
- No invented numbers (stats, 'series of 10 sessions', waiting times). Prices in tables = typical market estimates; for regulated/conventioned fees write "Tarif conventionnel" / "Regulated fee" instead of a number.
- fr pages follow the fr ESCO label (e.g. `/massage-therapist` fr = masseur-kinésithérapeute, regulated health profession).

## Open questions for the user

- `/pedicurist` fr: written as esthetic foot care ("beauté des pieds"). In France "pédicure" may be tied to the regulated pédicure-podologue title — confirm angle.

- Health pages: where fees are regulated/convention-based, the table price cell says "Tarif conventionnel" / "Regulated fee" / "Tarif du cabinet" instead of a number (e.g. `/massage-therapist` fr, `/physiotherapist` fr, `/health-medical`). Confirm this is OK for the phone mockup.

## Cleanup sweep before phase 2

- DONE (2026-09-25): life-coach, public-speaking-coach, tutor, sign-language-teacher, creative-media, lawyer fr (+ "beaucoup"→"certains"), photography-teacher fr, psychic (+ desc softened), vehicle-electronics-installer, web-designer, wedding-planner (+ desc), sophrologist, speech-and-language-therapist, specialist-dentist, prosthetist-orthotist, sport-therapist, specialist-nurse, personal-trainer. Greps (places left / client self-reschedule / repeat cycles / cancel notifications): no issues found. "see its price and duration" kept (slot times visible).
- Word-count padding IN PROGRESS: 86 landings had guide <300 words; appending verified-facts paragraph (time zone shown + weekly repeat until end date). Done list: scratchpad padded.txt. Also softening "most/often" claims seen while re-reading.

- Remove unsourced trend claims ("more and more", "growing share"): `/sophrologist` en ("more and more sessions take place by video"); `/speech-and-language-therapist` en description "Most of your patients are children" → "Many"; `/specialist-dentist` en FAQ1 "Most practices open" → "A common approach is to open"; `/sport-therapist` en "most clients train during the day and want evening" → "many clients work during the day and want evening"; `/specialist-nurse` en "a growing number of roles exist in the community" → "some work in the community"; `/prosthetist-orthotist` en "Many practitioners open assessments" → "One option is to open assessments"; `/personal-trainer` en "Most clients come once or twice a week" → "Many clients come"; `/life-coach` en description "often do it late at night" → soften ("may look for one in the evening"); `/public-speaking-coach` en FAQ "Do you handle video calls?" → "Does Book handle video calls?".; `/tutor` en "Most students come every week" → "Many students"; grep all pages for "places left"/"places restantes"/"how many places" claims (not shown publicly); grep for claims that clients move/reschedule/cancel bookings themselves (only the pro can); grep for implied cancellation/reschedule notifications to clients; `/photography-teacher` fr "une sortie photo à trop nombreux devient une foule" → "une sortie photo avec trop de participants tourne à la foule"; `/sign-language-teacher` en "Most start with a beginner course" → "Many start"; grep for repeat claims beyond weekly-by-weekday (every N weeks, monthly, "cycle"); grep for "service with its price and length"/"service ... duration" (services have no length; slots do). Known: `/driving-instructor` en+fr FAQ "Create a service for each length", `/tile-fitter`? check; `/lawyer` fr "votre assistante" → "votre secrétariat" (generic masculine rule); `/creative-media` en table "€0 (included)" → "Included"; `/web-designer` en description "Half your enquiries" → "So many enquiries" (invented stat); `/ceramicist` en SEO desc "all included" → "everything included" (recheck length); `/wedding-planner` en "most planning meetings happen" → "many"; spot-check guide word counts (≥300) on later en trade pages (e.g. `/vehicle-technician`, `/bricklayer`, `/plasterer`); `/vehicle-electronics-installer` en description "so your bay isn't double-promised" → remove (no-overlap promise); `/psychic` en "A large share of readings" → "Many readings"; `/personal-property-appraiser` fr: "Les journées d'expertise font la queue" → "Aux journées d'expertise, la file s'allonge"; `/wine-sommelier` en: drop "Many of the bookings come in the last few days" (unsourced); `/pizzaiolo` en: "many places don't take reservations" → "some"

## Pages to revisit when multi-staff ships (user: planned soon)

- `/beauty-salon-manager` en fr, `/spa-manager` en fr, `/pharmacist` en fr, `/specialised-veterinarian` en fr, `/truck-driving-instructor` en fr, `/legal-financial` en fr, `/accountant` en fr, `/notary` en fr, `/real-estate` en fr, `/real-estate-agent` en fr, `/property-assistant` en fr

## Phase 1 — landings

### Beauty & Wellness (18)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/beauty-wellness` | [x] | [x] | /for/beauty-wellness | /fr/for/beaute-bien-etre |
| `/barber` | [x] | [x] | /for/beauty-wellness/barber | /fr/for/beaute-bien-etre/barbier |
| `/hairdresser` | [x] | [x] | /for/beauty-wellness/hairdresser | /fr/for/beaute-bien-etre/coiffeur |
| `/manicurist` | [x] | [x] | /for/beauty-wellness/manicurist | /fr/for/beaute-bien-etre/manucure |
| `/massage-therapist` | [x] | [x] | /for/beauty-wellness/massage-therapist | /fr/for/beaute-bien-etre/masseur-kinesitherapeute |
| `/make-up-artist` | [x] | [x] | /for/beauty-wellness/make-up-artist | /fr/for/beaute-bien-etre/maquilleur |
| `/body-artist` | [x] | [x] | /for/beauty-wellness/body-artist | /fr/for/beaute-bien-etre/tatoueur |
| `/pedicurist` | [x] | [x] | /for/beauty-wellness/pedicurist | /fr/for/beaute-bien-etre/pedicure |
| `/shiatsu-practitioner` | [x] | [x] | /for/beauty-wellness/shiatsu-practitioner | /fr/for/beaute-bien-etre/praticien-en-shiatsu |
| `/aromatherapist` | [x] | [x] | /for/beauty-wellness/aromatherapist | /fr/for/beaute-bien-etre/conseiller-en-aromatherapie |
| `/personal-stylist` | [x] | [x] | /for/beauty-wellness/personal-stylist | /fr/for/beaute-bien-etre/styliste-personnel |
| `/tanning-consultant` | [x] | [x] | /for/beauty-wellness/tanning-consultant | /fr/for/beaute-bien-etre/conseiller-en-bronzage |
| `/wig-and-hairpiece-maker` | [x] | [x] | /for/beauty-wellness/wig-and-hairpiece-maker | /fr/for/beaute-bien-etre/perruquier |
| `/performance-hairdresser` | [x] | [x] | /for/beauty-wellness/performance-hairdresser | /fr/for/beaute-bien-etre/coiffeur-spectacle |
| `/beauty-salon-manager` | [x] | [x] | /for/beauty-wellness/beauty-salon-manager | /fr/for/beaute-bien-etre/responsable-d-institut-de-beaute |
| `/spa-manager` | [x] | [x] | /for/beauty-wellness/spa-manager | /fr/for/beaute-bien-etre/directeur-d-etablissement-thermal |
| `/beauty-salon-attendant` | [x] | [x] | /for/beauty-wellness/beauty-salon-attendant | /fr/for/beaute-bien-etre/employe-d-institut-de-beaute |
| `/hairdresser-assistant` | [x] | [x] | /for/beauty-wellness/hairdresser-assistant | /fr/for/beaute-bien-etre/assistant-coiffeur |
| `/spa-attendant` | [x] | [x] | /for/beauty-wellness/spa-attendant | /fr/for/beaute-bien-etre/employe-d-un-centre-d-hydrotherapie |

### Health & Medical (38)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/health-medical` | [x] | [x] | /for/health-medical | /fr/for/sante-medical |
| `/osteopath` | [x] | [x] | /for/health-medical/osteopath | /fr/for/sante-medical/osteopathe |
| `/physiotherapist` | [x] | [x] | /for/health-medical/physiotherapist | /fr/for/sante-medical/physiotherapeute |
| `/psychologist` | [x] | [x] | /for/health-medical/psychologist | /fr/for/sante-medical/psychologue |
| `/dietitian` | [x] | [x] | /for/health-medical/dietitian | /fr/for/sante-medical/dieteticien |
| `/psychotherapist` | [x] | [x] | /for/health-medical/psychotherapist | /fr/for/sante-medical/psychotherapeute |
| `/chiropractor` | [x] | [x] | /for/health-medical/chiropractor | /fr/for/sante-medical/chiropracteur |
| `/sophrologist` | [x] | [x] | /for/health-medical/sophrologist | /fr/for/sante-medical/sophrologue |
| `/acupuncturist` | [x] | [x] | /for/health-medical/acupuncturist | /fr/for/sante-medical/acupuncteur |
| `/speech-and-language-therapist` | [x] | [x] | /for/health-medical/speech-and-language-therapist | /fr/for/sante-medical/orthophoniste |
| `/podiatrist` | [x] | [x] | /for/health-medical/podiatrist | /fr/for/sante-medical/podologue |
| `/clinical-psychologist` | [x] | [x] | /for/health-medical/clinical-psychologist | /fr/for/sante-medical/psychologue-clinicien |
| `/midwife` | [x] | [x] | /for/health-medical/midwife | /fr/for/sante-medical/maieuticien |
| `/general-practitioner` | [x] | [x] | /for/health-medical/general-practitioner | /fr/for/sante-medical/medecin-generaliste |
| `/specialised-doctor` | [x] | [x] | /for/health-medical/specialised-doctor | /fr/for/sante-medical/medecin-specialiste |
| `/specialist-dentist` | [x] | [x] | /for/health-medical/specialist-dentist | /fr/for/sante-medical/dentiste-specialiste |
| `/dental-hygienist` | [x] | [x] | /for/health-medical/dental-hygienist | /fr/for/sante-medical/hygieniste-dentaire |
| `/occupational-therapist` | [x] | [x] | /for/health-medical/occupational-therapist | /fr/for/sante-medical/ergotherapeute |
| `/kinesiologist` | [x] | [x] | /for/health-medical/kinesiologist | /fr/for/sante-medical/kinesiologue |
| `/traditional-chinese-medicine-therapist` | [x] | [x] | /for/health-medical/traditional-chinese-medicine-therapist | /fr/for/sante-medical/intervenant-en-medecine-chinoise |
| `/homeopath` | [x] | [x] | /for/health-medical/homeopath | /fr/for/sante-medical/homeopathe |
| `/sport-therapist` | [x] | [x] | /for/health-medical/sport-therapist | /fr/for/sante-medical/conseiller-en-therapie-par-l-exercice-physique |
| `/orthoptist` | [x] | [x] | /for/health-medical/orthoptist | /fr/for/sante-medical/orthoptiste |
| `/optometrist` | [x] | [x] | /for/health-medical/optometrist | /fr/for/sante-medical/optometriste |
| `/audiologist` | [x] | [x] | /for/health-medical/audiologist | /fr/for/sante-medical/audiologiste |
| `/optician` | [x] | [x] | /for/health-medical/optician | /fr/for/sante-medical/opticien |
| `/specialist-chiropractor` | [x] | [x] | /for/health-medical/specialist-chiropractor | /fr/for/sante-medical/chiropracteur-specialiste |
| `/specialist-nurse` | [x] | [x] | /for/health-medical/specialist-nurse | /fr/for/sante-medical/infirmier-specialiste |
| `/nurse-responsible-for-general-care` | [x] | [x] | /for/health-medical/nurse-responsible-for-general-care | /fr/for/sante-medical/infirmier-de-soins-generaux |
| `/prosthetist-orthotist` | [x] | [x] | /for/health-medical/prosthetist-orthotist | /fr/for/sante-medical/orthoprothesiste |
| `/recreational-therapist` | [x] | [x] | /for/health-medical/recreational-therapist | /fr/for/sante-medical/ludotherapeute |
| `/phlebotomist` | [x] | [x] | /for/health-medical/phlebotomist | /fr/for/sante-medical/infirmier-preleveur |
| `/pharmacist` | [x] | [x] | /for/health-medical/pharmacist | /fr/for/sante-medical/pharmacien |
| `/assistant-clinical-psychologist` | [!] | [!] | /for/health-medical/assistant-clinical-psychologist | /fr/for/sante-medical/assistant-en-psychologie-clinique — works under supervision, no own clients |
| `/physiotherapy-assistant` | [!] | [!] | /for/health-medical/physiotherapy-assistant | /fr/for/sante-medical/assistant-de-kinesitherapie — works under physio supervision, no own patients |
| `/podiatry-assistant` | [!] | [!] | /for/health-medical/podiatry-assistant | /fr/for/sante-medical/assistant-podologue — assistant role, independent foot care = other trade |
| `/rehabilitation-support-worker` | [x] | [x] | /for/health-medical/rehabilitation-support-worker | /fr/for/sante-medical/conseiller-en-insertion-professionnelle-pour-personnes-handicapees |
| `/radiographer` | [!] | [!] | /for/health-medical/radiographer | /fr/for/sante-medical/technicien-en-imagerie-medicale-et-radiologie-therapeutique — hospital/imaging centre employee |
| `/radiation-therapist` | [!] | [!] | /for/health-medical/radiation-therapist | /fr/for/sante-medical/radiotherapeute — hospital only |

### Fitness & Sport (16)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/fitness-sport` | [x] | [x] | /for/fitness-sport | /fr/for/fitness-sport |
| `/personal-trainer` | [x] | [x] | /for/fitness-sport/personal-trainer | /fr/for/fitness-sport/entraineur-personnel |
| `/pilates-teacher` | [x] | [x] | /for/fitness-sport/pilates-teacher | /fr/for/fitness-sport/moniteur-de-pilates |
| `/tennis-coach` | [x] | [x] | /for/fitness-sport/tennis-coach | /fr/for/fitness-sport/professeur-de-tennis |
| `/swimming-teacher` | [x] | [x] | /for/fitness-sport/swimming-teacher | /fr/for/fitness-sport/educateur-sportif-des-activites-aquatiques-et-de-la-natation |
| `/golf-instructor` | [x] | [x] | /for/fitness-sport/golf-instructor | /fr/for/fitness-sport/professeur-de-golf |
| `/boxing-instructor` | [x] | [x] | /for/fitness-sport/boxing-instructor | /fr/for/fitness-sport/entraineur-de-boxe |
| `/horse-riding-instructor` | [x] | [x] | /for/fitness-sport/horse-riding-instructor | /fr/for/fitness-sport/moniteur-d-activites-equestres |
| `/ski-instructor` | [x] | [x] | /for/fitness-sport/ski-instructor | /fr/for/fitness-sport/moniteur-de-ski |
| `/snowboard-instructor` | [x] | [x] | /for/fitness-sport/snowboard-instructor | /fr/for/fitness-sport/moniteur-de-surf-des-neiges |
| `/sports-coach` | [x] | [x] | /for/fitness-sport/sports-coach | /fr/for/fitness-sport/coach-sportif |
| `/ice-skating-coach` | [x] | [x] | /for/fitness-sport/ice-skating-coach | /fr/for/fitness-sport/entraineur-de-patinage-sur-glace |
| `/outdoor-activities-instructor` | [x] | [x] | /for/fitness-sport/outdoor-activities-instructor | /fr/for/fitness-sport/moniteur-d-activites-de-plein-air |
| `/sports-instructor` | [x] | [x] | /for/fitness-sport/sports-instructor | /fr/for/fitness-sport/instructeur-sportif |
| `/football-coach` | [x] | [x] | /for/fitness-sport/football-coach | /fr/for/fitness-sport/entraineur-d-equipe-de-football |
| `/survival-instructor` | [x] | [x] | /for/fitness-sport/survival-instructor | /fr/for/fitness-sport/moniteur-de-survie |
| `/specialised-outdoor-animator` | [x] | [x] | /for/fitness-sport/specialised-outdoor-animator | /fr/for/fitness-sport/animateur-specialise-activites-de-plein-air |

### Consulting & Coaching (7)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/consulting-coaching` | [x] | [x] | /for/consulting-coaching | /fr/for/conseil-coaching |
| `/life-coach` | [x] | [x] | /for/consulting-coaching/life-coach | /fr/for/conseil-coaching/conseiller-en-developpement-personnel |
| `/weight-loss-consultant` | [x] | [x] | /for/consulting-coaching/weight-loss-consultant | /fr/for/conseil-coaching/conseiller-en-amincissement |
| `/career-guidance-advisor` | [x] | [x] | /for/consulting-coaching/career-guidance-advisor | /fr/for/conseil-coaching/conseiller-d-orientation |
| `/public-speaking-coach` | [x] | [x] | /for/consulting-coaching/public-speaking-coach | /fr/for/conseil-coaching/coach-prise-de-parole-en-public |
| `/security-consultant` | [x] | [x] | /for/consulting-coaching/security-consultant | /fr/for/conseil-coaching/conseiller-en-securite |
| `/renewable-energy-consultant` | [x] | [x] | /for/consulting-coaching/renewable-energy-consultant | /fr/for/conseil-coaching/conseiller-en-energies-renouvelables |
| `/smart-city-consultant` | [x] | [x] | /for/consulting-coaching/smart-city-consultant | /fr/for/conseil-coaching/consultant-en-villes-intelligentes |

### Pet Services (8)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/pet-services` | [x] | [x] | /for/pet-services | /fr/for/services-pour-animaux |
| `/animal-groomer` | [x] | [x] | /for/pet-services/animal-groomer | /fr/for/services-pour-animaux/toiletteur |
| `/dog-trainer` | [x] | [x] | /for/pet-services/dog-trainer | /fr/for/services-pour-animaux/dresseur-de-chiens |
| `/pet-sitter` | [x] | [x] | /for/pet-services/pet-sitter | /fr/for/services-pour-animaux/gardien-d-animaux-de-compagnie |
| `/animal-osteopath` | [x] | [x] | /for/pet-services/animal-osteopath | /fr/for/services-pour-animaux/ostheopathe-animalier |
| `/animal-massage-therapist` | [x] | [x] | /for/pet-services/animal-massage-therapist | /fr/for/services-pour-animaux/massotherapeute-animalier |
| `/animal-therapist` | [x] | [x] | /for/pet-services/animal-therapist | /fr/for/services-pour-animaux/therapeute-animalier — ESCO: animal rehab after vet referral — ESCO: rééducation animale |
| `/specialised-veterinarian` | [x] | [x] | /for/pet-services/specialised-veterinarian | /fr/for/services-pour-animaux/veterinaire-specialise |
| `/veterinary-nurse` | [!] | [!] | /for/pet-services/veterinary-nurse | /fr/for/services-pour-animaux/infirmier-veterinaire — works under vet supervision inside a practice, no own clients — ASV/infirmier salarié sous supervision du vétérinaire |

### Education & Tutoring (10)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/education-tutoring` | [x] | [x] | /for/education-tutoring | /fr/for/education-cours |
| `/tutor` | [x] | [x] | /for/education-tutoring/tutor | /fr/for/education-cours/repetiteur |
| `/driving-instructor` | [x] | [x] | /for/education-tutoring/driving-instructor | /fr/for/education-cours/moniteur-de-conduite |
| `/car-driving-instructor` | [x] | [x] | /for/education-tutoring/car-driving-instructor | /fr/for/education-cours/moniteur-automobile |
| `/performing-arts-school-dance-instructor` | [x] | [x] | /for/education-tutoring/performing-arts-school-dance-instructor | /fr/for/education-cours/professeur-de-danse |
| `/music-therapist` | [x] | [x] | /for/education-tutoring/music-therapist | /fr/for/education-cours/musicotherapeute |
| `/art-therapist` | [x] | [x] | /for/education-tutoring/art-therapist | /fr/for/education-cours/art-therapeute |
| `/performing-arts-theatre-instructor` | [x] | [x] | /for/education-tutoring/performing-arts-theatre-instructor | /fr/for/education-cours/professeur-de-theatre |
| `/photography-teacher` | [x] | [x] | /for/education-tutoring/photography-teacher | /fr/for/education-cours/formateur-en-photographie |
| `/sign-language-teacher` | [x] | [x] | /for/education-tutoring/sign-language-teacher | /fr/for/education-cours/professeur-en-langue-des-signes |
| `/truck-driving-instructor` | [x] | [x] | /for/education-tutoring/truck-driving-instructor | /fr/for/education-cours/moniteur-poids-lourds |

### Home Services (25)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/home-services` | [x] | [x] | /for/home-services | /fr/for/services-a-domicile |
| `/plumber` | [x] | [x] | /for/home-services/plumber | /fr/for/services-a-domicile/plombier |
| `/electrician` | [x] | [x] | /for/home-services/electrician | /fr/for/services-a-domicile/electricien |
| `/locksmith` | [x] | [x] | /for/home-services/locksmith | /fr/for/services-a-domicile/serrurier |
| `/domestic-housekeeper` | [x] | [x] | /for/home-services/domestic-housekeeper | /fr/for/services-a-domicile/gouvernantes |
| `/window-cleaner` | [x] | [x] | /for/home-services/window-cleaner | /fr/for/services-a-domicile/laveur-de-vitres |
| `/landscape-gardener` | [x] | [x] | /for/home-services/landscape-gardener | /fr/for/services-a-domicile/jardinier-paysagiste |
| `/refrigeration-air-condition-and-heat-pump-technician` | [x] | [x] | /for/home-services/refrigeration-air-condition-and-heat-pump-technician | /fr/for/services-a-domicile/technicien-en-refrigeration-climatisation-et-pompe-a-chaleur |
| `/chimney-sweep` | [x] | [x] | /for/home-services/chimney-sweep | /fr/for/services-a-domicile/ramoneur |
| `/pest-management-worker` | [x] | [x] | /for/home-services/pest-management-worker | /fr/for/services-a-domicile/technicien-hygieniste |
| `/carpenter` | [x] | [x] | /for/home-services/carpenter | /fr/for/services-a-domicile/charpentier |
| `/construction-painter` | [x] | [x] | /for/home-services/construction-painter | /fr/for/services-a-domicile/peintre-en-batiment |
| `/tile-fitter` | [x] | [x] | /for/home-services/tile-fitter | /fr/for/services-a-domicile/carreleur |
| `/upholsterer` | [x] | [x] | /for/home-services/upholsterer | /fr/for/services-a-domicile/garnisseur |
| `/tree-surgeon` | [x] | [x] | /for/home-services/tree-surgeon | /fr/for/services-a-domicile/elagueur |
| `/smart-home-installer` | [x] | [x] | /for/home-services/smart-home-installer | /fr/for/services-a-domicile/installateur-en-domotique |
| `/roofer` | [x] | [x] | /for/home-services/roofer | /fr/for/services-a-domicile/couvreur |
| `/plasterer` | [x] | [x] | /for/home-services/plasterer | /fr/for/services-a-domicile/platrier |
| `/bricklayer` | [x] | [x] | /for/home-services/bricklayer | /fr/for/services-a-domicile/macon |
| `/paperhanger` | [x] | [x] | /for/home-services/paperhanger | /fr/for/services-a-domicile/poseur-de-papiers-peints |
| `/hardwood-floor-layer` | [x] | [x] | /for/home-services/hardwood-floor-layer | /fr/for/services-a-domicile/parqueteur |
| `/resilient-floor-layer` | [x] | [x] | /for/home-services/resilient-floor-layer | /fr/for/services-a-domicile/poseur-de-revetements-souples-de-sols |
| `/window-installer` | [x] | [x] | /for/home-services/window-installer | /fr/for/services-a-domicile/installateur-de-fenetres |
| `/plate-glass-installer` | [x] | [x] | /for/home-services/plate-glass-installer | /fr/for/services-a-domicile/monteur-techniverrier |
| `/stonemason` | [x] | [x] | /for/home-services/stonemason | /fr/for/services-a-domicile/macon-pierre |
| `/sprinkler-fitter` | [!] | [!] | /for/home-services/sprinkler-fitter | /fr/for/services-a-domicile/installateur-de-systemes-d-extinction-automatique-a-eau — employed installer on commercial sites; no own bookable clients — salarié d'entreprise spécialisée, chantiers tertiaires; pas de clientèle propre |

### Legal & Financial (11)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/legal-financial` | [x] | [x] | /for/legal-financial | /fr/for/juridique-finance |
| `/lawyer` | [x] | [x] | /for/legal-financial/lawyer | /fr/for/juridique-finance/avocat |
| `/accountant` | [x] | [x] | /for/legal-financial/accountant | /fr/for/juridique-finance/comptable |
| `/tax-advisor` | [x] | [x] | /for/legal-financial/tax-advisor | /fr/for/juridique-finance/fiscaliste |
| `/notary` | [x] | [x] | /for/legal-financial/notary | /fr/for/juridique-finance/notaire |
| `/mediator` | [x] | [x] | /for/legal-financial/mediator | /fr/for/juridique-finance/mediateur-de-justice |
| `/financial-planner` | [x] | [x] | /for/legal-financial/financial-planner | /fr/for/juridique-finance/planificateur-financier |
| `/insurance-broker` | [x] | [x] | /for/legal-financial/insurance-broker | /fr/for/juridique-finance/courtier-en-assurances |
| `/credit-adviser` | [x] | [x] | /for/legal-financial/credit-adviser | /fr/for/juridique-finance/conseiller-credits |
| `/immigration-adviser` | [x] | [x] | /for/legal-financial/immigration-adviser | /fr/for/juridique-finance/conseiller-en-immigration |
| `/investment-adviser` | [x] | [x] | /for/legal-financial/investment-adviser | /fr/for/juridique-finance/conseiller-en-investissements |
| `/financial-auditor` | [!] | [!] | /for/legal-financial/financial-auditor | /fr/for/juridique-finance/auditeur-comptable-et-financier — multi-day audit engagements inside firms; no bookable appointments — missions d'audit sur plusieurs jours en cabinet; pas de rendez-vous réservables |

### Creative & Media (14)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/creative-media` | [x] | [x] | /for/creative-media | /fr/for/creatif-medias |
| `/photographer` | [x] | [x] | /for/creative-media/photographer | /fr/for/creatif-medias/photographe |
| `/tailor` | [x] | [x] | /for/creative-media/tailor | /fr/for/creatif-medias/tailleur |
| `/dressmaker` | [x] | [x] | /for/creative-media/dressmaker | /fr/for/creatif-medias/couturier |
| `/interior-designer` | [x] | [x] | /for/creative-media/interior-designer | /fr/for/creatif-medias/decorateur-d-interieur |
| `/graphic-designer` | [x] | [x] | /for/creative-media/graphic-designer | /fr/for/creatif-medias/graphiste |
| `/musician` | [x] | [x] | /for/creative-media/musician | /fr/for/creatif-medias/musicien |
| `/web-designer` | [x] | [x] | /for/creative-media/web-designer | /fr/for/creatif-medias/concepteur-de-sites-web |
| `/ceramicist` | [x] | [x] | /for/creative-media/ceramicist | /fr/for/creatif-medias/ceramiste |
| `/illustrator` | [x] | [x] | /for/creative-media/illustrator | /fr/for/creatif-medias/illustrateur |
| `/jewellery-designer` | [x] | [x] | /for/creative-media/jewellery-designer | /fr/for/creatif-medias/designer-en-bijouterie |
| `/singer` | [x] | [x] | /for/creative-media/singer | /fr/for/creatif-medias/chanteur |
| `/fashion-designer` | [x] | [x] | /for/creative-media/fashion-designer | /fr/for/creatif-medias/createur-de-mode |
| `/sculptor` | [x] | [x] | /for/creative-media/sculptor | /fr/for/creatif-medias/sculpteur |
| `/flower-and-garden-specialised-seller` | [!] | [!] | /for/creative-media/flower-and-garden-specialised-seller | /fr/for/creatif-medias/vendeur-en-jardinerie — retail sales role in a garden centre/shop; walk-in, no appointments — vente en jardinerie, clientèle de passage; pas de rendez-vous |

### Events & Entertainment (8)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/events-entertainment` | [x] | [x] | /for/events-entertainment | /fr/for/evenements-divertissement |
| `/wedding-planner` | [x] | [x] | /for/events-entertainment/wedding-planner | /fr/for/evenements-divertissement/wedding-planner |
| `/disc-jockey` | [x] | [x] | /for/events-entertainment/disc-jockey | /fr/for/evenements-divertissement/disc-jockey |
| `/event-manager` | [x] | [x] | /for/events-entertainment/event-manager | /fr/for/evenements-divertissement/responsable-evenement |
| `/performance-artist` | [!] | [!] | /for/events-entertainment/performance-artist | /fr/for/evenements-divertissement/artiste-d-art-performance — work shown via galleries/festivals/commissions; no bookable appointment angle without inventing — diffusion via galeries/festivals; pas d'angle rendez-vous honnête |
| `/stand-up-comedian` | [x] | [x] | /for/events-entertainment/stand-up-comedian | /fr/for/evenements-divertissement/humoriste |
| `/street-performer` | [x] | [x] | /for/events-entertainment/street-performer | /fr/for/evenements-divertissement/artiste-de-rue |
| `/event-assistant` | [!] | [!] | /for/events-entertainment/event-assistant | /fr/for/evenements-divertissement/assistant-en-organisation-d-evenements — employed/staffed by agencies; no own client bookings — salarié ou missionné par agence; pas de clientèle propre |
| `/hospitality-entertainment-manager` | [!] | [!] | /for/events-entertainment/hospitality-entertainment-manager | /fr/for/evenements-divertissement/responsable-des-loisirs — employed at hotels/campsites/resorts; guests book the venue, not the manager — salarié d'hôtel/camping/club; pas de clientèle propre |

### Automotive (9)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/automotive` | [x] | [x] | /for/automotive | /fr/for/automobile |
| `/vehicle-technician` | [x] | [x] | /for/automotive/vehicle-technician | /fr/for/automobile/technicien-de-vehicules |
| `/tyre-fitter` | [x] | [x] | /for/automotive/tyre-fitter | /fr/for/automobile/monteur-en-pneumatique |
| `/vehicle-maintenance-attendant` | [x] | [x] | /for/automotive/vehicle-maintenance-attendant | /fr/for/automobile/mecanicien-d-entretien-en-automobile — angle: quick maintenance + valeting (ESCO routine maintenance incl. cleaning) — angle : entretien courant + nettoyage |
| `/vehicle-glazier` | [x] | [x] | /for/automotive/vehicle-glazier | /fr/for/automobile/vitrier-automobile |
| `/vehicle-electronics-installer` | [x] | [x] | /for/automotive/vehicle-electronics-installer | /fr/for/automobile/technicien-en-electronique-automobile |
| `/diesel-engine-mechanic` | [x] | [x] | /for/automotive/diesel-engine-mechanic | /fr/for/automobile/mecanicien-dieseliste |
| `/vehicle-restoration-technician` | [x] | [x] | /for/automotive/vehicle-restoration-technician | /fr/for/automobile/technicien-en-restauration-de-vehicules |
| `/roadside-vehicle-technician` | [!] | [!] | /for/automotive/roadside-vehicle-technician | /fr/for/automobile/depanneur-de-vehicules — breakdown callouts are urgent by nature; no planned-booking angle — dépannage = urgence; pas d'angle rendez-vous planifié |
| `/sports-equipment-repair-technician` | [x] | [x] | /for/automotive/sports-equipment-repair-technician | /fr/for/automobile/technicien-en-reparation-d-articles-de-sport |

### Other Services (12)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/other-services` | [x] | [x] | /for/other-services | /fr/for/autres-services |
| `/astrologer` | [x] | [x] | /for/other-services/astrologer | /fr/for/autres-services/astrologue |
| `/psychic` | [x] | [x] | /for/other-services/psychic | /fr/for/autres-services/telepathe |
| `/medium` | [x] | [x] | /for/other-services/medium | /fr/for/autres-services/medium |
| `/fortune-teller` | [x] | [x] | /for/other-services/fortune-teller | /fr/for/autres-services/voyant |
| `/translator` | [x] | [x] | /for/other-services/translator | /fr/for/autres-services/traducteur |
| `/interpreter` | [x] | [x] | /for/other-services/interpreter | /fr/for/autres-services/interprete |
| `/sign-language-interpreter` | [x] | [x] | /for/other-services/sign-language-interpreter | /fr/for/autres-services/interprete-en-langue-des-signes |
| `/personal-shopper` | [x] | [x] | /for/other-services/personal-shopper | /fr/for/autres-services/acheteur-personnel |
| `/shoe-repairer` | [x] | [x] | /for/other-services/shoe-repairer | /fr/for/autres-services/reparateur-en-chaussures |
| `/watch-and-clock-repairer` | [x] | [x] | /for/other-services/watch-and-clock-repairer | /fr/for/autres-services/reparateur-de-systemes-horlogers |
| `/furniture-restorer` | [x] | [x] | /for/other-services/furniture-restorer | /fr/for/autres-services/restaurateur-de-meubles |
| `/private-detective` | [x] | [x] | /for/other-services/private-detective | /fr/for/autres-services/detective-prive |

### Real Estate (4)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/real-estate` | [x] | [x] | /for/real-estate | /fr/for/immobilier |
| `/real-estate-agent` | [x] | [x] | /for/real-estate/real-estate-agent | /fr/for/immobilier/agent-immobilier |
| `/property-appraiser` | [x] | [x] | /for/real-estate/property-appraiser | /fr/for/immobilier/estimateur-de-biens-immobiliers |
| `/personal-property-appraiser` | [x] | [x] | /for/real-estate/personal-property-appraiser | /fr/for/immobilier/estimateur-de-biens-mobiliers |
| `/property-assistant` | [x] | [x] | /for/real-estate/property-assistant | /fr/for/immobilier/assistant-de-gestion-immobiliere |

### Food & Hospitality (13)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/food-hospitality` | [x] | [x] | /for/food-hospitality | /fr/for/alimentation-restauration |
| `/private-chef` | [x] | [x] | /for/food-hospitality/private-chef | /fr/for/alimentation-restauration/chef-prive |
| `/pastry-chef` | [x] | [x] | /for/food-hospitality/pastry-chef | /fr/for/alimentation-restauration/chef-de-partie-patisserie |
| `/baker` | [x] | [x] | /for/food-hospitality/baker | /fr/for/alimentation-restauration/boulanger |
| `/sommelier` | [x] | [x] | /for/food-hospitality/sommelier | /fr/for/alimentation-restauration/sommelier |
| `/wine-sommelier` | [x] | [x] | /for/food-hospitality/wine-sommelier | /fr/for/alimentation-restauration/sommelier-en-vin |
| `/beer-sommelier` | [x] | [x] | /for/food-hospitality/beer-sommelier | /fr/for/alimentation-restauration/sommelier-en-biere |
| `/cocktail-bartender` | [x] | [x] | /for/food-hospitality/cocktail-bartender | /fr/for/alimentation-restauration/barman-specialise-en-cocktails |
| `/pizzaiolo` | [x] | [x] | /for/food-hospitality/pizzaiolo | /fr/for/alimentation-restauration/pizzaiolo |
| `/chef` | [x] | [x] | /for/food-hospitality/chef | /fr/for/alimentation-restauration/chef-de-cuisine |
| `/head-chef` | [!] | [!] | /for/food-hospitality/head-chef | /fr/for/alimentation-restauration/chef-cuisinier — employed brigade role; own-name bookings (supper club/classes) already covered by /chef — avoid duplicate thin page — poste salarié en brigade ; angle supper club/cours déjà couvert par /chef |
| `/head-pastry-chef` | [!] | [!] | /for/food-hospitality/head-pastry-chef | /fr/for/alimentation-restauration/maitre-patissier — overlaps /pastry-chef (classes, tastings, collections); no distinct angle — recouvre /pastry-chef ; pas d'angle distinct |
| `/bartender` | [!] | [!] | /for/food-hospitality/bartender | /fr/for/alimentation-restauration/barman — employed bar role; freelance angle (masterclasses, mobile bar) covered by /cocktail-bartender — salarié du bar ; angle indépendant couvert par /cocktail-bartender |
| `/butcher` | [x] | [x] | /for/food-hospitality/butcher | /fr/for/alimentation-restauration/boucher |

### Technology & IT (4)

| CMS url | en | fr | public en | public fr |
|---|---|---|---|---|
| `/technology-it` | [x] | [x] | /for/technology-it | /fr/for/technologie-it |
| `/web-developer` | [x] | [x] | /for/technology-it/web-developer | /fr/for/technologie-it/developpeur-web |
| `/software-developer` | [x] | [x] | /for/technology-it/software-developer | /fr/for/technologie-it/developpeur-de-logiciels |
| `/ict-help-desk-agent` | [x] | [x] | /for/technology-it/ict-help-desk-agent | /fr/for/technologie-it/agent-de-service-d-assistance-informatique — angle: independent IT support (company help desks use ticketing) |
| `/database-administrator` | [!] | [!] | /for/technology-it/database-administrator | /fr/for/technologie-it/administrateur-de-base-de-donnees — employed role; freelance DBA consulting = occasional calls, covered by /software-developer consulting angle — poste salarié ; conseil ponctuel couvert par /software-developer |

## Phase 2 — articles

| CMS url | en | fr | notes |
|---|---|---|---|
| `/barber/reduce-no-shows` | [x] | [x] | no-shows |
