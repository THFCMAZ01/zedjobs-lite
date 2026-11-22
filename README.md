# ZedJobs Lite

ZedJobs Lite is an in-progress job board for ICT opportunities in Zambia. It uses Next.js App Router, TypeScript, Tailwind CSS, and Supabase Auth/Postgres.

## Current features

- Candidate-only registration and login through Supabase Auth.
- Candidate-only routes protected by the candidate layout.
- A job board showing published roles, company, location, category, and salary in ZMW.
- Published job detail pages with a not-found state for removed or unpublished roles.
- Candidate applications with optional cover letters and a personal application list.

Recruiter-facing screens and application review tools are still under development. Registration currently creates candidate accounts only.

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
