import Link from 'next/link'
import { getPublishedJobs } from '@/lib/jobs'
import { relatedName } from '@/lib/job-utils'

export default async function CandidateJobsPage() {
  const jobs = await getPublishedJobs()

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          ZedJobs · Zambia
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
          ICT jobs in Zambia
        </h1>
        <p className="mt-2 text-gray-600">
          Explore the latest technology opportunities from local employers.
        </p>
      </header>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No jobs posted yet</h2>
          <p className="mt-2 text-gray-600">Check back soon for new ICT opportunities.</p>
        </div>
      ) : (
        <section aria-label="Published jobs" className="space-y-4">
          <p className="text-sm text-gray-600">
            {jobs.length} {jobs.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/candidate/jobs/${job.id}`}
              className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950 group-hover:text-blue-800">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {relatedName(job.companies) ?? 'Company'}
                    {job.location ? ` · ${job.location}` : ''}
                  </p>
                  {relatedName(job.job_roles) && (
                    <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                      {relatedName(job.job_roles)}
                    </span>
                  )}
                </div>
                {job.salary_range && (
                  <span className="shrink-0 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800">
                    ZMW {job.salary_range}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
