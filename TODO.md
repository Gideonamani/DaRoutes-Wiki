# Next TODO Items

## On next session
- Clarify how the MapLibre style (https://demotiles.maplibre.org/style.json) renders our basemap and whether we need a custom tile set
- Promote current editor account to admin in the `profile` table (so full dashboard access works without manual SQL tweaks)
- Design the pipeline for collecting geodata via OSMTracker (Android), exporting GPX/GeoJSON, and uploading into Daroutes (storage format, validation, UI)

## High Priority
- Implement route variant management UI (listing and toggling variants per route).
- Add role management screen to promote/demote profiles between admin/editor/viewer.
- Build automated tests for API routes (`src/app/api/routes/*`) using Playwright or Vitest.
- [Phase 1] Polish the route hero with start/end "Name & Via" labels, corridor tags, and consistent color swatch usage.
- [Phase 1] Ensure the routes and stops view pairs an accessible list with the map visualization for quick scanning.
- [Phase 1] Launch the structured fare table component covering adult, student, and short-turn fares in TZS.
- [Phase 1] Curate the ticket gallery with authentic scans and moderation so commuters trust the samples.
- [Phase 1] Add notes and extra insights editing/display so operators and the community can share tips.

## Medium Priority
- Introduce caching strategy for public API responses (ISR tuning or Supabase edge functions).
- Add analytics hooks to track dashboard activity (e.g., Supabase logging or Posthog).
- Document deployment checklist covering Supabase storage rules and auth providers.
- [Phase 2] Introduce bus view tabs segmented by vehicle type (daladala, coaster, BRT).
- [Phase 2] Build a contributors spotlight with avatars, badges, and rotating highlights.
- [Phase 2] Implement gamified verification (points/badges for confirming fares, stops, notes).

## Low Priority
- Explore Tesseract.js integration for automatic ticket OCR in the upload workflow.
- Prototype community suggestions queue with moderation dashboard.
- Add end-to-end tests for the MapLibre editor interactions.
- [Phase 3] Chart morning/evening peak demand using survey data as the initial source.
- [Phase 3] Provide operator dashboards summarizing reliability, crowding, and service span.
- [Phase 3] Scope an analytics API for fleet owners and NGOs to consume route insights.
- [Phase 4] Publish travel time estimates with min/max averages for key journeys.
- [Phase 4] Capture accessibility details (wheelchair access, level boarding, amenities).
- [Phase 4] Add reliability, safety, and comfort scoring driven by community votes.
- [Phase 4] Surface nearby route connections and ride-hailing pickup suggestions.

Keep this list updated as features evolve. Completed items should be moved to the changelog under the appropriate release or the `[Unreleased]` section.
