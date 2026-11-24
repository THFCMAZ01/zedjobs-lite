'use client'

import { useActionState } from 'react'
import { createCompanyProfile } from '@/app/actions/jobs'

export default function CompanyProfileForm() {
  const [state, formAction, pending] = useActionState(createCompanyProfile, null)

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-5">
      <div>
        <label htmlFor="company-name" className="block text-sm font-semibold text-slate-800">
          Employer name
        </label>
        <input
          id="company-name"
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="organization"
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 shadow-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
      {state?.success && <p role="status" className="text-sm font-medium text-emerald-700">{state.success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save employer profile'}
      </button>
    </form>
  )
}
