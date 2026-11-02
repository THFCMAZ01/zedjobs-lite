import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify they are actually a candidate, not a recruiter
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'candidate') {
    redirect('/recruiter/jobs')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">ZedJobs</span>
              <div className="ml-10 flex space-x-8">
                <Link href="/candidate/jobs" className="text-gray-900 border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium">
                  Browse Jobs
                </Link>
                <Link href="/candidate/applications" className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                  My Applications
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
