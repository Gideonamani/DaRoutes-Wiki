# Agent Playbook

Guidelines for coding agents contributing to the Daroutes Route CMS + Wiki repository.

## Core Principles
- **Security first**: never expose Supabase secrets, service-role keys, or private user data in outputs or logs.
- **TypeScript everywhere**: new code must be authored in TypeScript/TSX and respect the existing strictness config.
- **Accessibility & performance**: ensure UI changes consider WCAG contrast (see `src/lib/colors.ts`) and avoid unbounded client bundle growth.
- **Small, atomic commits**: group related changes together with clear, conventional commit messages (`feat:`, `fix:`, `chore:`, etc.).

## Before You Start
1. Sync with the latest `master` branch (`git pull --rebase`).
2. Read open items in `TODO.md` and existing issues to pick priorities.
3. Confirm environment variables in `.env.local` are present; never commit actual secrets.

## During Implementation
- Prefer server components for data-fetching routes unless interactivity requires client components.
- Use Supabase helpers from `src/lib/supabaseClient.ts` and `src/lib/supabaseServer.ts`; do not instantiate raw clients ad hoc.
- Validate forms with Zod + react-hook-form; reuse schemas when possible.
- Update `supabase.sql` if schema changes are required and document the migration steps in the PR description.
- Keep UX consistent: reuse components in `src/components` and extend them rather than duplicating styles.

## Testing Checklist
- Run `npm run lint` and `npm run typecheck` before submitting changes.
- Add or update tests when modifying business logic, especially Supabase queries and API handlers.
- Manually verify dashboard flows (create/edit route, attachment upload) when they are affected.

## Documentation & Tracking
- Reflect noteworthy changes in `CHANGELOG.md` under `[Unreleased]`, moving items to a new version upon release.
- Update `TODO.md` with newly identified tasks or mark completed ones (and move them to the changelog).
- Record major architectural decisions in future ADRs (create `docs/adr/` entries as needed).

## Pull Request Expectations
- Provide a concise summary, testing evidence, and screenshots/gifs for UI changes.
- List any new environment variables or Supabase policies required.
- Request review from a project maintainer; avoid merging your own PR without approval.

Following this playbook keeps the repo stable, auditable, and friendly to future contributors.
