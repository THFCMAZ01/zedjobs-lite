import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getRecruiterJobFormData, getRecruiterJobs } from '@/app/actions/jobs'
import NewJobForm from './new-job-form'

export default async function NewRecruiterJobPage() {
  const [formData, recruiterData] = await Promise.all([
    getRecruiterJobFormData(),
    getRecruiterJobs(),
  ])

  if (recruiterData.ok && !recruiterData.company) redirect('/recruiter/jobs#company-profile')

  if (!formData.ok) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6" role="alert">
        <h1 className="text-xl font-bold">A little setup is needed</h1>
        <p className="mt-2 text-sm leading-6 text-amber-950">{formData.message}</p>
        <Link href="/recruiter/jobs" className="mt-4 inline-flex text-sm font-semibold text-blue-800 underline">Back to your jobs</Link>
      </section>
    )
  }

  if (formData.roles.length === 0) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6" role="alert">
        <h1 className="text-xl font-bold">No job categories are configured</h1>
        <p className="mt-2 text-sm leading-6 text-amber-950">Add at least one entry to the Supabase <code>job_roles</code> table, then return here.</p>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/recruiter/jobs" className="text-sm font-semibold text-blue-800 hover:underline">← Back to your jobs</Link>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-800">New listing</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Post an ICT job</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">The job will be saved as a draft. You can publish it from your jobs page when it’s ready.</p>
        <NewJobForm roles={formData.roles} />
      </div>
    </div>
  )
}
