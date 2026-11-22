'use server'

import { createClient } from '@/lib/supabase/server'
import { buildCandidateSignupMetadata, parseSignupInput } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const input = parseSignupInput(
    formData.get('full_name'),
    formData.get('email'),
    formData.get('password'),
  )

  if (!input.ok) return { error: input.message }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: buildCandidateSignupMetadata(input.fullName),
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.session) {
    return { success: 'Account created. Check your email to confirm it, then sign in.' }
  }

  redirect('/candidate/jobs')
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    return { error: error.message }
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'recruiter') {
      redirect('/recruiter/jobs')
    } else {
      redirect('/candidate/jobs')
    }
  }

  // Fallback in case something weird happens
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
