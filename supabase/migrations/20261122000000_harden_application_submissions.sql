-- Keep candidate application rows trustworthy when requests bypass the UI.
-- This migration is intentionally not applied automatically by the app.

drop policy if exists "Candidates can submit applications"
  on public.applications;

create policy "Candidates can submit applications"
  on public.applications
  for insert
  to authenticated
  with check (
    candidate_id = (select auth.uid())
    and job_id is not null
    and status = 'pending'
    and recruiter_notes is null
    and cv_url is null
    and exists (
      select 1
      from public.jobs as j
      where j.id = applications.job_id
        and j.status = 'published'
    )
  );
