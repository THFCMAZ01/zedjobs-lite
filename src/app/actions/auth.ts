'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, role },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Because you disabled "Confirm Email" in Supabase, the user is logged in immediately.
  // We check the role they just submitted and route them.
  if (role === 'recruiter') {
    redirect('/recruiter/jobs')
  } else {
    redirect('/candidate/jobs')
  }
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
