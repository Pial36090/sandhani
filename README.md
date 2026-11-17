# Sandhani Hospital Website

A mobile-first, multi-page hospital website using plain HTML, CSS, and JavaScript. No build step or dependencies are required.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home, quick access, specialties, sample specialists, hospital statistics, and facility highlights |
| `about.html` | Mission, leadership message, standards, medical technology, and accessibility |
| `departments.html` | Searchable/filterable specialty directory with conditions, diagnostic guidance, and visit advice |
| `doctors.html` | Searchable/filterable sample doctor directory with OPD schedules and booking links |
| `appointments.html` | Four-part appointment request with WhatsApp handoff; does not collect clinical details |
| `patient-guide.html` | OPD and visiting hours, sample checkup packages, billing, pharmacy, and ambulance information |
| `contact.html` | Contact form, map, visit directions, phone/WhatsApp actions, and department extensions |

## Run locally

Open `index.html` in a browser, or start a local static server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Update before publishing

The site is a design preview and contains illustrative hospital details. Replace and verify all sample information before using it with patients:

- Search all HTML files for `Sandhani` and `Khulna`. Verify the hospital's exact street address and update it before publishing.
- Emergency and ambulance links and WhatsApp buttons use `+880 1319 772783` (`01319772783`). Confirm this is the correct number for each service before publishing.
- Replace the doctor names, profile photos, qualifications, OPD schedules, and sample statistics with approved information.
- Update package pricing, visiting/OPD hours, pharmacy/ambulance details, insurance partners, and accreditation claims with current hospital data.
- Replace the map query and footer map with the exact hospital location; add verified emergency entrance and parking directions.
- Replace social link placeholders with the hospital's official social profiles.
- Connect the appointment and contact forms to a secure backend before collecting or transmitting patient data. The appointment form currently prepares a WhatsApp message in the visitor's browser; it does not save or submit the request to a hospital system.

Colors and spacing are controlled by CSS variables at the top of `assets/css/styles.css`. Page content and reusable card patterns are directly editable in the HTML files.