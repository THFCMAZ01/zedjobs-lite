import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedJob } from '@/lib/jobs'
import { relatedName } from '@/lib/job-utils'
import { getMyApplicationForJob } from '@/lib/jobs'
import ApplicationForm from './application-form'

export default async function CandidateJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await getPublishedJob(id)

  if (!job) notFound()

  const application = await getMyApplicationForJob(job.id)
  const company = relatedName(job.companies)
  const role = relatedName(job.job_roles)
  const postedDate = new Intl.DateTimeFormat('en-ZM', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lusaka',
  }).format(new Date(job.created_at))

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/candidate/jobs"
        className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        <span aria-hidden="true" className="mr-2">←</span>
        Back to jobs
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <header className="border-b border-gray-200 bg-white p-6 sm:p-8">
          {role && (
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {role}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
            {job.title}
          </h1>
          <p className="mt-3 text-gray-600">
            {[company, job.location].filter(Boolean).join(' · ') || 'Zambia'}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {job.salary_range && (
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900">
                ZMW {job.salary_range}
              </span>
            )}
            <span className="text-sm text-gray-500">Posted {postedDate}</span>
          </div>
        </header>

        <section aria-labelledby="job-description" className="p-6 sm:p-8">
          <h2 id="job-description" className="text-lg font-semibold text-gray-950">
            About the role
          </h2>
          <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
            {job.description?.trim() || 'The employer has not provided a description for this role.'}
          </p>
        </section>
      </article>

      <section aria-labelledby="apply-heading" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="apply-heading" className="text-xl font-semibold text-gray-950">
          Apply for this role
        </h2>
        {application ? (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p>You have already applied for this job.</p>
            <p className="mt-1">Current status: {application.status.replaceAll('_', ' ')}</p>
            <Link href="/candidate/applications" className="mt-3 inline-block font-semibold underline">
              View my applications
            </Link>
          </div>
        ) : (
          <div className="mt-5">
            <ApplicationForm jobId={job.id} />
          </div>
        )}
      </section>
    </div>
  )
}
