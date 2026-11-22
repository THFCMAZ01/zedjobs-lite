export default function CandidateJobDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6" aria-label="Loading job details">
      <div className="h-5 w-28 rounded bg-gray-200" />
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-8">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-9 w-2/3 rounded bg-gray-200" />
        <div className="h-5 w-1/2 rounded bg-gray-200" />
        <div className="h-24 rounded bg-gray-100" />
      </div>
    </div>
  )
}
