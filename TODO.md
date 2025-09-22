# Next TODO Items

## On next session
- Clarify how the MapLibre style (https://demotiles.maplibre.org/style.json) renders our basemap and whether we need a custom tile set
- Promote current editor account to admin in the `profile` table (so full dashboard access works without manual SQL tweaks)
- Design the pipeline for collecting geodata via OSMTracker (Android), exporting GPX/GeoJSON, and uploading into Daroutes (storage format, validation, UI)


## High Priority
- Implement route variant management UI (listing and toggling variants per route).
- Add role management screen to promote/demote profiles between admin/editor/viewer.
- Build automated tests for API routes (`src/app/api/routes/*`) using Playwright or Vitest.

## Medium Priority
- Introduce caching strategy for public API responses (ISR tuning or Supabase edge functions).
- Add analytics hooks to track dashboard activity (e.g., Supabase logging or Posthog).
- Document deployment checklist covering Supabase storage rules and auth providers.

## Low Priority
- Explore Tesseract.js integration for automatic ticket OCR in the upload workflow.
- Prototype community suggestions queue with moderation dashboard.
- Add end-to-end tests for the MapLibre editor interactions.

Keep this list updated as features evolve. Completed items should be moved to the changelog under the appropriate release or the `[Unreleased]` section.

