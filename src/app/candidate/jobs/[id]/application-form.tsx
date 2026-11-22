'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { applyToJob } from '@/app/actions/applications'

export default function ApplicationForm({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState(applyToJob, null)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="job_id" value={jobId} />
      <div>
        <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-900">
          Cover letter <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <p id="cover-letter-help" className="mt-1 text-sm text-gray-600">
          Briefly tell the employer why you are interested. Maximum 5,000 characters.
        </p>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={7}
          maxLength={5000}
          aria-describedby="cover-letter-help"
          className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Share a little about your relevant experience and interest in the role."
        />
      </div>

      {state && (
        <div
          role={state.status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={state.status === 'error'
            ? 'rounded-lg bg-red-50 p-3 text-sm text-red-800'
            : 'rounded-lg bg-green-50 p-3 text-sm text-green-800'}
        >
          <p>{state.message}</p>
          {state.status === 'success' && (
            <Link href="/candidate/applications" className="mt-2 inline-block font-semibold underline">
              View my applications
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || state?.status === 'success'}
        className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Submitting…' : state?.status === 'success' ? 'Application submitted' : 'Submit application'}
      </button>
    </form>
  )
}
