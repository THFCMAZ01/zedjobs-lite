import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'recruiter' || user.app_metadata?.role !== 'recruiter') redirect('/')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link href="/recruiter/jobs" className="text-xl font-bold tracking-tight text-blue-800">
              ZedJobs <span className="text-sm font-medium text-slate-500">Employer</span>
            </Link>
            <Link href="/recruiter/jobs" className="text-sm font-semibold text-slate-700 hover:text-blue-800">
              Jobs
            </Link>
          </div>
          <form action={logout}>
            <button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  )
}
