import { ArrowRight, BarChart3, Home, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#0c1118]">
      <Navbar />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(195,232,121,0.07),transparent_34%),radial-gradient(ellipse_at_90%_24%,rgba(137,189,166,0.06),transparent_30%)]" />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-[#c3e879]">Your practice, your pace</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Leaderboard</h1>
          <p className="mt-4 text-base leading-7 text-slate-400">A place to celebrate progress with the PrepCircle community.</p>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101514]/90 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" aria-labelledby="leaderboard-status">
          <div className="grid gap-8 md:grid-cols-[1fr_230px] md:items-center">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3e879]/10 text-[#c3e879]">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 id="leaderboard-status" className="text-2xl font-semibold text-white">Rankings are on the way</h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-400">
                We’ll publish rankings once they can be calculated fairly from completed sessions. In the meantime, your feedback and history give you a private view of your progress.
              </p>
              <button onClick={() => navigate('/')} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#c3e879] px-4 py-3 text-sm font-semibold text-[#17200d] transition-colors hover:bg-[#d1ef93]">
                Start practicing <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#101514] p-5">
              <BarChart3 className="mb-4 h-5 w-5 text-[#c3e879]" />
              <p className="text-sm font-medium text-[#e8eee6]">What will be ranked</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                <li>Completed sessions</li>
                <li>Contribution scores</li>
                <li>Consistent participation</li>
              </ul>
            </div>
          </div>
        </section>

        <button onClick={() => navigate('/')} className="btn-secondary mt-8 inline-flex items-center gap-2">
          <Home className="h-4 w-4" /> Back home
        </button>
      </main>
    </div>
  );
}

export default Leaderboard;
