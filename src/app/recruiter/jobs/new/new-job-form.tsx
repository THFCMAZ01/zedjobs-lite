'use client'

import { useActionState } from 'react'
import { createJob } from '@/app/actions/jobs'

type JobRole = { id: string; name: string }

export default function NewJobForm({ roles }: { roles: JobRole[] }) {
  const [state, formAction, pending] = useActionState(createJob, null)

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <div>
        <label htmlFor="job-title" className="block text-sm font-semibold text-slate-800">Job title</label>
        <input id="job-title" name="title" required minLength={3} maxLength={120} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" placeholder="e.g. Junior Software Developer" />
      </div>
      <div>
        <label htmlFor="job-role" className="block text-sm font-semibold text-slate-800">Category</label>
        <select id="job-role" name="job_role_id" required defaultValue="" className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
          <option value="" disabled>Select a category</option>
          {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="job-location" className="block text-sm font-semibold text-slate-800">Location</label>
        <input id="job-location" name="location" required minLength={2} maxLength={120} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" placeholder="e.g. Lusaka or Remote" />
      </div>
      <div>
        <label htmlFor="job-salary" className="block text-sm font-semibold text-slate-800">Salary range <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="job-salary" name="salary_range" maxLength={120} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" placeholder="e.g. K12,000–K18,000 per month" />
      </div>
      <div>
        <label htmlFor="job-description" className="block text-sm font-semibold text-slate-800">Description</label>
        <textarea id="job-description" name="description" required minLength={20} maxLength={12000} rows={8} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" placeholder="Describe the work, required experience, and how candidates will contribute." />
      </div>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="submit" disabled={pending} className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Saving…' : 'Save as draft'}
        </button>
      </div>
    </form>
  )
}
