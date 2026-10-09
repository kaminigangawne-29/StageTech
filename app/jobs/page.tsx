'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DISCIPLINES, disciplineLabel, disciplineColor } from '@/lib/disciplines';

function fmt(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function JobCard({ job }: { job: any }) {
  const companyName =
    typeof job.company === 'string' ? job.company : job.company?.companyName || 'Theatre Company';
  const location = job.location || job.company?.location || 'Mumbai';

  return (
    <div className="nb-card nb-card-hover p-5 flex flex-col gap-3" style={{ borderLeft: `14px solid ${disciplineColor(job.roleNeeded)}` }}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-black uppercase leading-tight">{job.title}</h3>
        {job.budget && <span className="nb-badge shrink-0" style={{ background: '#FFD60A' }}>{job.budget}</span>}
      </div>
      <p className="font-bold text-sm">🎭 {companyName}</p>
      <div>
        <span className="nb-badge" style={{ background: disciplineColor(job.roleNeeded) }}>
          {disciplineLabel(job.roleNeeded)}
        </span>
      </div>
      <div className="text-sm font-semibold space-y-1">
        {(job.startDate || job.endDate) && (
          <div>📅 {fmt(job.startDate)} {job.endDate ? `– ${fmt(job.endDate)}` : ''}</div>
        )}
        <div>📍 {location}</div>
      </div>
      {job.description && <p className="text-sm text-[#333] line-clamp-2">{job.description}</p>}
      <Link href={`/jobs/${job.id}`} className="nb-btn nb-btn-red mt-auto self-end !py-2 !px-4 !text-sm">
        View &amp; Apply →
      </Link>
    </div>
  );
}

const MOCK_JOBS = [
  {
    id: 'demo-job-1',
    title: 'Senior Stage Lighting Technician',
    roleNeeded: 'LIGHTING',
    status: 'OPEN',
    location: 'Prithvi Theatre, Juhu, Mumbai',
    startDate: '2026-10-15',
    endDate: '2026-10-30',
    budget: '₹3,500 / day',
    description: 'Seeking an experienced lighting tech for a 15-day production run of a contemporary Hindi play at Prithvi Theatre.',
    company: { companyName: 'Prithvi Players', location: 'Mumbai' }
  },
  {
    id: 'demo-job-2',
    title: 'Live Sound Engineer & Operator',
    roleNeeded: 'SOUND',
    status: 'OPEN',
    location: 'NCPA, Nariman Point, Mumbai',
    startDate: '2026-11-01',
    endDate: '2026-11-10',
    budget: '₹4,000 / day',
    description: 'Live audio mixing and QLab playback for musical theatre performance. Experience with Yamaha digital consoles required.',
    company: { companyName: 'Royal Stage Productions', location: 'Mumbai' }
  },
  {
    id: 'demo-job-3',
    title: 'Assistant Stage Manager',
    roleNeeded: 'STAGE_MANAGEMENT',
    status: 'OPEN',
    location: 'Royal Opera House, Mumbai',
    startDate: '2026-10-20',
    endDate: '2026-11-05',
    budget: '₹2,800 / day',
    description: 'Calling cues, managing backstage props, actor transitions, and maintaining prompt book.',
    company: { companyName: 'Drama Circle Mumbai', location: 'Mumbai' }
  },
  {
    id: 'demo-job-4',
    title: 'Set & Prop Designer',
    roleNeeded: 'SET_DESIGN',
    status: 'OPEN',
    location: 'Andheri West, Mumbai',
    startDate: '2026-10-18',
    endDate: '2026-11-12',
    budget: '₹45,000 fixed',
    description: 'Set construction and realistic prop design for experimental black-box drama show.',
    company: { companyName: 'The Wings Collective', location: 'Mumbai' }
  },
  {
    id: 'demo-job-5',
    title: 'Costume & Wardrobe Supervisor',
    roleNeeded: 'COSTUME',
    status: 'OPEN',
    location: 'Bandra, Mumbai',
    startDate: '2026-10-25',
    endDate: '2026-11-08',
    budget: '₹3,000 / day',
    description: 'Managing period costumes, quick wardrobe changes backstage, and garment maintenance.',
    company: { companyName: 'Kala Studio', location: 'Mumbai' }
  }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (role) params.set('role', role);
      if (location) params.set('location', location);
      const res = await fetch(`/api/jobs?${params.toString()}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const list = data.jobs ?? data.data ?? [];
        if (list.length > 0) {
          setJobs(list);
          setLoading(false);
          return;
        }
      }
      let filtered = MOCK_JOBS;
      if (role) {
        filtered = filtered.filter(j => j.roleNeeded === role);
      }
      if (location) {
        filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
      }
      setJobs(filtered);
    } catch {
      let filtered = MOCK_JOBS;
      if (role) {
        filtered = filtered.filter(j => j.roleNeeded === role);
      }
      if (location) {
        filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
      }
      setJobs(filtered);
    } finally {
      setLoading(false);
    }
  }, [role, location]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 250);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b-4 border-black bg-[#3A86FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <span className="nb-badge mb-4" style={{ background: '#FFD60A' }}>🎟️ Now Casting Crew</span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none" style={{ textShadow: '4px 4px 0 #000' }}>
            Open Positions
          </h1>
          <p className="mt-4 font-bold text-white max-w-xl">
            Backstage gigs across Mumbai &amp; India — lights, sound, sets, costumes, stage &amp; PR.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="nb-input !w-auto min-w-[220px] cursor-pointer">
              <option value="">All Roles</option>
              {DISCIPLINES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="📍 Location (e.g. Mumbai, Andheri)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="nb-input !w-auto min-w-[260px]"
            />
            {(role || location) && (
              <button className="nb-btn nb-btn-white" onClick={() => { setRole(''); setLocation(''); }}>Clear</button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="nb-card h-56 animate-pulse bg-[#eee]" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="nb-card p-12 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-3">🎭</div>
            <h2 className="text-2xl font-black uppercase">No open positions</h2>
            <p className="font-semibold mt-2">Try changing your filters, or check back soon.</p>
          </div>
        ) : (
          <>
            <p className="font-extrabold uppercase text-sm mb-5">
              {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} found
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
