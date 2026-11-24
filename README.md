# ZedJobs Lite

ZedJobs Lite is an in-progress job board for ICT opportunities in Zambia. It uses Next.js App Router, TypeScript, Tailwind CSS, and Supabase Auth/Postgres.

## Current features

- Candidate-only registration and login through Supabase Auth.
- Candidate-only routes protected by the candidate layout.
- A job board showing published roles, company, location, category, and salary in ZMW.
- Published job detail pages with a not-found state for removed or unpublished roles.
- Candidate applications with optional cover letters and a personal application list.

Recruiters can create an employer profile, save draft jobs, and publish or unpublish their listings. Application review tools are still under development. Public registration creates candidate accounts only; a project administrator must provision recruiter accounts by setting both `profiles.role` and the Auth user's admin-controlled `app_metadata.role` to `recruiter`. Do not grant recruiter access through user-editable signup metadata.

## Local development

Install dependencies and create `.env.local` with the public Supabase project URL and anon key expected by `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts`. Keep credentials out of source control.

```bash
npm install
npm run dev
```

The Supabase project must already contain the tables and row-level security policies used by the app. Before enabling candidate submissions in an environment, apply the reviewed SQL migration in `supabase/migrations/`; the app does not run it automatically.

## Checks

```bash
npm test
npm run lint
npm run build
```
