import Link from 'next/link'
import { getRecruiterJobs } from '@/app/actions/jobs'
import CompanyProfileForm from '@/app/recruiter/company-profile-form'
import JobStatusForm from '@/app/recruiter/jobs/job-status-form'

type JobRoleRelation = { name: string } | { name: string }[] | null

function getRoleName(role: JobRoleRelation) {
  if (Array.isArray(role)) return role[0]?.name ?? 'ICT role'
  return role?.name ?? 'ICT role'
}

export default async function RecruiterJobsPage() {
  const result = await getRecruiterJobs()

  if (!result.ok) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6" role="alert">
        <h1 className="text-xl font-bold text-slate-950">Employer jobs</h1>
        <p className="mt-2 text-sm leading-6 text-amber-950">{result.message}</p>
      </section>
    )
  }

  if (!result.company) {
    return (
      <section id="company-profile" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">First step</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Set up your employer profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Add the employer name candidates will see on your published job listings.
        </p>
        <CompanyProfileForm />
      </section>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-800">{result.company.name}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Your jobs</h1>
          <p className="mt-2 text-sm text-slate-600">Create a draft, review the details, then publish it for candidates.</p>
        </div>
        <Link
          href="/recruiter/jobs/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Post a job
        </Link>
      </div>

      {result.jobs.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">No jobs yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
            Add your first ICT opening. New jobs start as drafts and won’t appear on the candidate board until you publish them.
          </p>
          <Link href="/recruiter/jobs/new" className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            Create your first job
          </Link>
        </section>
      ) : (
        <ul className="mt-8 space-y-4">
          {result.jobs.map((job) => (
            <li key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">{getRoleName(job.job_roles as JobRoleRelation)}</p>
                <h2 className="mt-1 text-lg font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{job.location || 'Location not specified'}</p>
              </div>
              <div className="mt-4 flex items-center gap-4 sm:mt-0">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${job.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                  {job.status}
                </span>
                <JobStatusForm jobId={job.id} status={job.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
