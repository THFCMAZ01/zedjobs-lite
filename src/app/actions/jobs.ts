'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getPublishedJobs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, location, salary_range, created_at,
      companies ( name ),
      job_roles ( name )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getRecruiterJobs() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, location, status, created_at,
      job_roles ( name ),
      applications ( count )
    `)
    .eq('companies.user_id', user!.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createJob(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get recruiter's company
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  if (!company) return { error: 'You must create a company profile first.' }

  const { error } = await supabase.from('jobs').insert({
    company_id: company.id,
    job_role_id: formData.get('job_role_id') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    location: formData.get('location') as string,
    salary_range: formData.get('salary_range') as string,
    status: 'draft',
  })

  if (error) return { error: error.message }
  revalidatePath('/recruiter/jobs')
  redirect('/recruiter/jobs')
}

export async function toggleJobStatus(jobId: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'

  const { error } = await supabase
    .from('jobs')
    .update({ status: newStatus })
    .eq('id', jobId)

  if (error) return { error: error.message }
  revalidatePath('/recruiter/jobs')
}