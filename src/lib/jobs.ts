import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/job-utils'

type RelatedName = { name: string } | { name: string }[] | null

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
