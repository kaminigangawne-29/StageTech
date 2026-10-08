import Link from 'next/link';

const TICKER = [
  '🔦 Lighting Designers', '🎛️ Lighting Operators', '🎚️ Sound Designers', '🎧 Sound Operators',
  '🎨 Art Directors', '🧵 Costume Designers', '🏛️ Set Designers', '📋 Stage Managers',
  '📣 Public Relations', '📍 Mumbai • Pune • Thane • Navi Mumbai',
];

const DISCIPLINE_TILES = [
  { e: '🔦', t: 'Lighting Designer', d: 'Paints the stage with light', c: '#FFD60A' },
  { e: '🎛️', t: 'Lighting Operator', d: 'Runs the board, calls the cues', c: '#FFE98A' },
  { e: '🎚️', t: 'Sound Designer', d: 'Builds the sonic world', c: '#3A86FF' },
  { e: '🎧', t: 'Sound Operator', d: 'Mixes it live, every night', c: '#9CC2FF' },
  { e: '🎨', t: 'Art Director', d: 'Owns the visual language', c: '#C8B6FF' },
  { e: '🧵', t: 'Costume Designer', d: 'Dresses every character', c: '#FF8FAB' },
  { e: '📣', t: 'Public Relations', d: 'Fills the seats', c: '#FF9F68' },
  { e: '📋', t: 'Stage Manager', d: 'Keeps the show running', c: '#7AE582' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero: stage with curtains & spotlights ── */}
      <section className="relative bg-[#1a1a2e] border-b-4 border-black">
        <div className="curtain-edge" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-24 text-center">
          <div className="spotlight-beam left-[8%]" style={{ animationDelay: '0s' }} />
          <div className="spotlight-beam right-[8%]" style={{ animationDelay: '-3s' }} />

          <span className="nb-badge relative" style={{ background: '#FFD60A' }}>🎭 Mumbai’s Backstage Network</span>

          <h1 className="relative mt-6 text-5xl sm:text-7xl lg:text-8xl font-black uppercase leading-[0.95] text-white" style={{ textShadow: '6px 6px 0 #E63946' }}>
            The Stage is Set.
            <br />
            <span className="bg-[#FFD60A] text-black px-3 inline-block -rotate-1 border-4 border-black shadow-[8px_8px_0_#000] mt-3" style={{ textShadow: 'none' }}>
              Your Career Awaits.
            </span>
          </h1>

          <p className="relative mt-8 max-w-2xl mx-auto text-lg font-bold text-[#FFF4D6]">
            StageTech connects light &amp; sound artists, designers, stage crew and PR pros with theatre productions
            across Mumbai and India — based on talent, not who you know.
          </p>

          <div className="relative mt-10 flex flex-wrap justify-center gap-5">
            <Link href="/signup?role=technician" className="nb-btn nb-btn-red !text-lg !px-8 !py-4">🔦 Join as Talent</Link>
            <Link href="/talent" className="nb-btn !text-lg !px-8 !py-4">🎬 Find Talent</Link>
          </div>
        </div>
        <div className="stage-floor" />
      </section>

      {/* ── Ticker ── */}
      <div className="ticker">
        <div>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-6">{t} <span className="text-[#E63946]">✦</span></span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="bg-[#FFD60A] border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-3 gap-4 text-center">
          {[
            ['500+', 'Technicians'],
            ['200+', 'Productions'],
            ['50+', 'Venues in Mumbai'],
          ].map(([n, l]) => (
            <div key={l} className="nb-card py-5 px-2 bg-white">
              <div className="text-3xl sm:text-5xl font-black">{n}</div>
              <div className="text-xs sm:text-sm font-extrabold uppercase mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disciplines ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <span className="nb-badge" style={{ background: '#C8B6FF' }}>🎟️ The Crew</span>
          <h2 className="text-4xl sm:text-5xl font-black uppercase mt-3">Every role. Every credit.</h2>
          <p className="font-bold mt-2">Designers and operators are listed separately — because they’re different crafts.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISCIPLINE_TILES.map((d, i) => (
            <Link
              key={d.t}
              href="/talent"
              className="nb-card nb-card-hover p-5 block"
              style={{ background: d.c, transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            >
              <div className="text-4xl">{d.e}</div>
              <div className="font-black uppercase text-lg mt-2 leading-tight">{d.t}</div>
              <div className="text-sm font-bold mt-1">{d.d}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[#E63946] border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-8">
          {[
            { e: '🖼️', t: 'Showcase Your Work', d: 'Build a portfolio with photos, plots, cue sheets and your production history — your work speaks for you.' },
            { e: '🔍', t: 'Find the Right Talent', d: 'Filter by discipline, Mumbai neighbourhood, availability and the tools they master.' },
            { e: '⚖️', t: 'Merit-Based Opportunities', d: 'No more word-of-mouth gatekeeping. Newcomers and veterans stand under the same spotlight.' },
          ].map((f) => (
            <div key={f.t} className="nb-card p-6">
              <div className="text-5xl">{f.e}</div>
              <h3 className="text-2xl font-black uppercase mt-3">{f.t}</h3>
              <p className="font-medium mt-2 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role cards ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-center text-4xl sm:text-5xl font-black uppercase mb-10">Pick your side of the curtain</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/signup?role=technician" className="nb-card nb-card-hover p-8 block bg-[#7AE582]">
            <div className="text-6xl">🔦</div>
            <h3 className="text-3xl font-black uppercase mt-3">I am a Technician</h3>
            <p className="font-bold mt-3">Create your profile, upload your portfolio and get discovered by productions across Mumbai.</p>
            <span className="nb-btn nb-btn-white mt-6">Create Talent Profile →</span>
          </Link>
          <Link href="/signup?role=production" className="nb-card nb-card-hover p-8 block bg-[#C8B6FF]">
            <div className="text-6xl">🎬</div>
            <h3 className="text-3xl font-black uppercase mt-3">I am Hiring</h3>
            <p className="font-bold mt-3">Post crew calls, browse verified portfolios and message the right artist directly.</p>
            <span className="nb-btn nb-btn-white mt-6">Start Hiring →</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black text-[#FFF4D6]">
        <div className="marquee-lights" />
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="font-black uppercase text-xl">🎭 Stage<span className="text-[#FFD60A]">Tech</span></div>
          <div className="text-sm font-bold">Made with ❤️ for Mumbai’s theatre community • © {new Date().getFullYear()} StageTech</div>
        </div>
      </footer>
    </div>
  );
}
