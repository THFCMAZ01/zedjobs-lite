import Link from 'next/link'

export default function CandidateJobNotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-gray-950">Job not found</h1>
      <p className="mt-3 text-gray-600">
        This job may have been removed or is no longer published.
      </p>
      <Link
        href="/candidate/jobs"
        className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Browse published jobs
      </Link>
    </div>
  )
}
