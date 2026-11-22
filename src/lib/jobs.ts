import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/job-utils'

type RelatedName = { name: string } | { name: string }[] | null

type ApplicationJob = { id: string; title: string; location: string | null }
type ApplicationJobRelation = ApplicationJob | ApplicationJob[] | null

export type PublishedJob = {
  id: string
  title: string
  description: string | null
  location: string | null
  salary_range: string | null
  created_at: string
  companies: RelatedName
  job_roles: RelatedName
}

export type CandidateApplication = {
  id: string
  status: string
  cover_letter: string | null
  created_at: string | null
  jobs: ApplicationJobRelation
}

export async function getPublishedJobs(): Promise<PublishedJob[]> {
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
  return (data ?? []) as unknown as PublishedJob[]
}

export async function getPublishedJob(id: string): Promise<PublishedJob | null> {
  if (!isUuid(id)) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, description, location, salary_range, created_at,
      companies ( name ),
      job_roles ( name )
    `)
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as unknown as PublishedJob | null
}

export async function getMyApplicationForJob(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('applications')
    .select('id, status')
    .eq('job_id', jobId)
    .eq('candidate_id', user.id)
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as { id: string; status: string } | null
}

export async function getMyApplications(): Promise<CandidateApplication[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id, status, cover_letter, created_at,
      jobs ( id, title, location )
    `)
    .eq('candidate_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as CandidateApplication[]
}
