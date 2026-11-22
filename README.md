# ZedJobs Lite

ZedJobs Lite is an in-progress job board for ICT opportunities in Zambia. It uses Next.js App Router, TypeScript, Tailwind CSS, and Supabase Auth/Postgres.

## Current features

- Candidate registration and login through Supabase Auth.
- Candidate-only routes protected by the candidate layout.
- A job board showing published roles, company, location, category, and salary in ZMW.
- Published job detail pages with a not-found state for removed or unpublished roles.

Recruiter-facing screens and candidate applications are still under development.

## Local development

Install dependencies and create `.env.local` with the public Supabase project URL and anon key expected by `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts`. Keep credentials out of source control.

```bash
npm install
npm run dev
```

The Supabase project must already contain the tables and row-level security policies used by the app. This repository does not currently include database migrations.

## Checks

```bash
npm run lint
npm run build
```
