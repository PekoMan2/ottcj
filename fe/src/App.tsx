import { Activity, ArrowLeft, MapPin, Radio } from 'lucide-react';
import { Link, Route, Routes } from 'react-router';

function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white sm:px-10 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="grid size-9 place-items-center bg-lime-400 text-zinc-950">
              <Activity aria-hidden="true" size={19} />
            </span>
            Run Tracker
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Radio aria-hidden="true" className="text-lime-400" size={16} />
            Live tracking soon
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 sm:py-24">
          <div className="mb-7 flex items-center gap-2 text-sm font-medium text-lime-400">
            <MapPin aria-hidden="true" size={18} />
            Live run
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] sm:text-7xl">
            Follow every step of the run.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            Live position, route progress, run details, and social updates will
            appear here when the runner sets off.
          </p>
        </section>

        <footer className="border-t border-zinc-800 pt-5 text-sm text-zinc-500">
          Location updates will begin on race day.
        </footer>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-white">
      <div className="text-center">
        <p className="text-sm font-medium text-lime-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <Link
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white"
          to="/"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to the run
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
