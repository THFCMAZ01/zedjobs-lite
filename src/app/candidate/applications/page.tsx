import Link from 'next/link'
import { getMyApplications } from '@/lib/jobs'
import type { CandidateApplication } from '@/lib/jobs'

function applicationJob(application: CandidateApplication) {
  if (Array.isArray(application.jobs)) return application.jobs[0] ?? null
  return application.jobs
}

function formatSubmittedDate(value: string | null) {
  if (!value) return 'Date unavailable'
  return new Intl.DateTimeFormat('en-ZM', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lusaka',
  }).format(new Date(value))
}

export default async function CandidateApplicationsPage() {
  const applications = await getMyApplications()

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Candidate dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">My applications</h1>
        <p className="mt-2 text-gray-600">Keep track of the roles you have applied for.</p>
      </header>

      {applications.length === 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-950">No applications yet</h2>
          <p className="mt-2 text-gray-600">When you apply for a job, it will appear here.</p>
          <Link
            href="/candidate/jobs"
            className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Browse jobs
          </Link>
        </section>
      ) : (
        <section aria-label="Your applications" className="space-y-4">
          {applications.map((application) => {
            const job = applicationJob(application)
            const card = (
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-950">
                      {job?.title ?? 'Job no longer available'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {job?.location ?? 'Details unavailable'}
                    </p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-sm font-medium capitalize text-amber-900">
                    {application.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Submitted {formatSubmittedDate(application.created_at)}
                </p>
                {application.cover_letter && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-medium text-gray-900">Your cover letter</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                      {application.cover_letter}
                    </p>
                  </div>
                )}
              </article>
            )

            return job ? (
              <Link
                key={application.id}
                href={`/candidate/jobs/${job.id}`}
                className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {card}
              </Link>
            ) : <div key={application.id}>{card}</div>
          })}
        </section>
      )}
    </div>
  )
}
