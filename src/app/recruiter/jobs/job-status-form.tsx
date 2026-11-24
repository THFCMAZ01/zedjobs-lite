'use client'

import { useActionState } from 'react'
import { toggleJobStatus } from '@/app/actions/jobs'

export default function JobStatusForm({ jobId, status }: { jobId: string; status: string }) {
  const [state, formAction, pending] = useActionState(toggleJobStatus, null)

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="job_id" value={jobId} />
      <button type="submit" disabled={pending} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? 'Updating…' : status === 'published' ? 'Move to draft' : 'Publish'}
      </button>
      {state?.error && <span role="alert" className="max-w-48 text-right text-xs text-red-700">{state.error}</span>}
    </form>
  )
}
