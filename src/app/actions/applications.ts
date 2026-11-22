'use server'

import { createClient } from '@/lib/supabase/server'
import { parseApplicationInput } from '@/lib/application-utils'
import type { ApplyActionState } from '@/lib/application-types'
import { revalidatePath } from 'next/cache'

export async function applyToJob(
  _previousState: ApplyActionState,
  formData: FormData,
): Promise<ApplyActionState> {
  const input = parseApplicationInput(
    formData.get('job_id'),
    formData.get('cover_letter'),
  )

  if (!input.ok) return { status: 'error', message: input.message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'error', message: 'Sign in with a candidate account to apply.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || profile?.role !== 'candidate') {
    return { status: 'error', message: 'Only candidate accounts can apply to jobs.' }
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id')
    .eq('id', input.jobId)
    .eq('status', 'published')
    .maybeSingle()

  if (jobError || !job) {
    return { status: 'error', message: 'This job is no longer available.' }
  }

  const { data: existingApplication, error: existingError } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', input.jobId)
    .eq('candidate_id', user.id)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    return { status: 'error', message: 'We could not check your application. Please try again.' }
  }

  if (existingApplication) {
    return { status: 'error', message: 'You have already applied for this job.' }
  }

  const { error: insertError } = await supabase.from('applications').insert({
    job_id: input.jobId,
    candidate_id: user.id,
    status: 'pending',
    cover_letter: input.coverLetter,
    cv_url: null,
    recruiter_notes: null,
  })

  if (insertError) {
    return { status: 'error', message: 'We could not submit your application. Please try again.' }
  }

  revalidatePath(`/candidate/jobs/${input.jobId}`)
  revalidatePath('/candidate/applications')
  return { status: 'success', message: 'Your application has been submitted.' }
}
