'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type RecruiterActionState = {
  error?: string
  success?: string
} | null

async function getRecruiterContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false as const, message: 'Sign in to manage recruiter jobs.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    return { ok: false as const, message: 'We could not verify your account role.' }
  }

  if (profile?.role !== 'recruiter' || user.app_metadata?.role !== 'recruiter') {
    return { ok: false as const, message: 'Only approved recruiter accounts can manage jobs.' }
  }

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id, name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (companyError) {
    return { ok: false as const, message: 'We could not load your employer profile.' }
  }

  return { ok: true as const, supabase, user, company }
}

export async function getRecruiterJobs() {
  const context = await getRecruiterContext()
  if (!context.ok) return context
  if (!context.company) return { ok: true as const, company: null, jobs: [] }

  const { data, error } = await context.supabase
    .from('jobs')
    .select(`
      id, title, location, status, created_at,
      job_roles ( name )
    `)
    .eq('company_id', context.company.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { ok: false as const, message: 'We could not load your jobs. Check that the Supabase job tables and policies are set up.' }
  }

  return {
    ok: true as const,
    company: context.company,
    jobs: data ?? [],
  }
}

export async function getRecruiterJobFormData() {
  const context = await getRecruiterContext()
  if (!context.ok) return context
  if (!context.company) {
    return { ok: false as const, message: 'Create an employer profile before adding a job.' }
  }

  const { data: roles, error } = await context.supabase
    .from('job_roles')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    return { ok: false as const, message: 'We could not load job categories from Supabase.' }
  }

  return { ok: true as const, roles: roles ?? [] }
}

export async function createCompanyProfile(
  _previousState: RecruiterActionState,
  formData: FormData,
): Promise<RecruiterActionState> {
  const context = await getRecruiterContext()
  if (!context.ok) return { error: context.message }
  if (context.company) return { error: 'Your employer profile already exists.' }

  const name = String(formData.get('name') ?? '').trim()
  if (name.length < 2 || name.length > 120) {
    return { error: 'Enter an employer name between 2 and 120 characters.' }
  }

  const { error } = await context.supabase.from('companies').insert({
    user_id: context.user.id,
    name,
  })

  if (error) {
    return { error: 'We could not save the employer profile. Check the companies table and its row-level security policy.' }
  }

  revalidatePath('/recruiter/jobs')
  return { success: 'Employer profile saved. You can now add a job.' }
}

export async function createJob(
  _previousState: RecruiterActionState,
  formData: FormData,
): Promise<RecruiterActionState> {
  const context = await getRecruiterContext()
  if (!context.ok) return { error: context.message }
  if (!context.company) return { error: 'Create an employer profile before adding a job.' }

  const jobRoleId = String(formData.get('job_role_id') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const location = String(formData.get('location') ?? '').trim()
  const salaryRange = String(formData.get('salary_range') ?? '').trim()

  if (!jobRoleId || title.length < 3 || title.length > 120) {
    return { error: 'Choose a job category and enter a title between 3 and 120 characters.' }
  }
  if (description.length < 20 || description.length > 12000) {
    return { error: 'The job description must be between 20 and 12,000 characters.' }
  }
  if (location.length < 2 || location.length > 120) {
    return { error: 'Enter a location between 2 and 120 characters.' }
  }
  if (salaryRange.length > 120) {
    return { error: 'Keep the salary range under 120 characters.' }
  }

  const { data: role, error: roleError } = await context.supabase
    .from('job_roles')
    .select('id')
    .eq('id', jobRoleId)
    .maybeSingle()

  if (roleError || !role) return { error: 'Choose a valid job category.' }

  const { error } = await context.supabase.from('jobs').insert({
    company_id: context.company.id,
    job_role_id: role.id,
    title,
    description,
    location,
    salary_range: salaryRange || null,
    status: 'draft',
  })

  if (error) {
    return { error: 'We could not save the job. Check the Supabase jobs table and its row-level security policy.' }
  }

  revalidatePath('/recruiter/jobs')
  redirect('/recruiter/jobs')
}

export async function toggleJobStatus(
  _previousState: RecruiterActionState,
  formData: FormData,
): Promise<RecruiterActionState> {
  const context = await getRecruiterContext()
  if (!context.ok) return { error: context.message }
  if (!context.company) return { error: 'Create an employer profile before managing jobs.' }

  const jobId = String(formData.get('job_id') ?? '').trim()
  if (!jobId) return { error: 'Choose a valid job.' }

  const { data: job, error: jobError } = await context.supabase
    .from('jobs')
    .select('id, status')
    .eq('id', jobId)
    .eq('company_id', context.company.id)
    .maybeSingle()

  if (jobError || !job) return { error: 'That job was not found in your employer account.' }

  const newStatus = job.status === 'published' ? 'draft' : 'published'
  const { error } = await context.supabase
    .from('jobs')
    .update({ status: newStatus })
    .eq('id', job.id)
    .eq('company_id', context.company.id)

  if (error) return { error: 'We could not update the job status.' }

  revalidatePath('/recruiter/jobs')
  revalidatePath('/candidate/jobs')
  return null
}
