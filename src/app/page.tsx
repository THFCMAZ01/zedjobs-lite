import Link from 'next/link'

const benefits = [
  {
    title: 'Made for ICT careers',
    description: 'Find technology roles across Zambia, from early career to experienced positions.',
  },
  {
    title: 'Clear job details',
    description: 'Review each role’s responsibilities, location, salary range, and employer.',
  },
  {
    title: 'Applications in one place',
    description: 'Apply with an optional cover letter and keep track of your submissions.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-blue-800">
            ZedJobs<span className="text-slate-500"> Lite</span>
          </Link>
          <nav aria-label="Account" className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
            Zambia’s ICT job board
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
            Find your next <span className="text-blue-800">tech opportunity.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Explore technology roles from local employers, review the details, and manage your applications in one place.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/candidate/jobs"
              className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Browse jobs
              <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Create a free account
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">For candidates exploring ICT careers in Zambia.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-800">
              Z
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">A simpler job search</p>
              <h2 className="mt-1 text-xl font-bold">Built around your next step</h2>
            </div>
          </div>
          <ul className="mt-7 space-y-4">
            {[
              'Browse published technology openings',
              'See salary ranges and role details',
              'Submit and track your applications',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">New to ZedJobs?</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Create a candidate account to browse available jobs and save your application history.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="What ZedJobs offers" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3 md:py-16">
          {benefits.map((benefit) => (
            <article key={benefit.title}>
              <h2 className="font-semibold text-slate-950">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} ZedJobs Lite</span>
          <span>Connecting Zambia’s ICT talent with opportunity.</span>
        </div>
      </footer>
    </main>
  )
}
