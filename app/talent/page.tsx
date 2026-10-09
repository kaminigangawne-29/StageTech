'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DISCIPLINES, disciplineLabel, disciplineColor } from '@/lib/disciplines';

const AVAILABILITY = [
  { label: 'All', value: '' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Open to offers', value: 'OPEN_TO_OFFERS' },
  { label: 'Booked', value: 'BOOKED' },
];

const AVAIL_STYLE: Record<string, { bg: string; label: string }> = {
  AVAILABLE: { bg: '#7AE582', label: 'Available' },
  OPEN_TO_OFFERS: { bg: '#FFD60A', label: 'Open to offers' },
  BOOKED: { bg: '#FF8FAB', label: 'Booked' },
};

function TechnicianCard({ tech }: { tech: any }) {
  const name: string = tech.fullName || tech.name || 'Theatre Technician';
  const initials =
    name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
  const avail = AVAIL_STYLE[(tech.availabilityStatus || 'AVAILABLE').toUpperCase()] || AVAIL_STYLE.AVAILABLE;
  const skills: string[] = Array.isArray(tech.skills)
    ? tech.skills.map((s: any) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean)
    : [];

  return (
    <div className="nb-card nb-card-hover p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {tech.profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tech.profileImageUrl} alt={name} className="w-16 h-16 object-cover border-4 border-black shrink-0" />
        ) : (
          <div
            className="w-16 h-16 border-4 border-black flex items-center justify-center text-2xl font-black shrink-0"
            style={{ background: disciplineColor(tech.primaryDiscipline) }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-black text-lg uppercase leading-tight truncate">{name}</div>
          <span className="nb-badge mt-1" style={{ background: disciplineColor(tech.primaryDiscipline) }}>
            {disciplineLabel(tech.primaryDiscipline)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-sm font-bold">
        <span>📍 {tech.locationCity || 'Mumbai'}</span>
        <span className="nb-badge" style={{ background: avail.bg }}>{avail.label}</span>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((s) => (
            <span key={s} className="nb-tag">{s}</span>
          ))}
          {skills.length > 3 && <span className="text-xs font-extrabold self-center">+{skills.length - 3}</span>}
        </div>
      )}

      <Link href={`/talent/${tech.id}`} className="nb-btn nb-btn-white mt-auto !py-2 !text-sm">
        View Profile →
      </Link>
    </div>
  );
}

const MOCK_TECHNICIANS = [
  {
    id: 'demo-tech-1',
    fullName: 'Aarav Mehta',
    name: 'Aarav Mehta',
    primaryDiscipline: 'LIGHTING_DESIGNER',
    locationCity: 'Mumbai',
    availabilityStatus: 'AVAILABLE',
    skills: ['GrandMA3', 'QLab 5', 'Rigging', 'DMX Protocol', 'Vectorworks'],
    profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop'
  },
  {
    id: 'demo-tech-2',
    fullName: 'Rhea Sharma',
    name: 'Rhea Sharma',
    primaryDiscipline: 'LIGHTING_OPERATOR',
    locationCity: 'Mumbai',
    availabilityStatus: 'OPEN_TO_OFFERS',
    skills: ['ETC Ion', 'DMX Patching', 'Moving Heads', 'Spotlight Operation'],
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop'
  },
  {
    id: 'demo-tech-3',
    fullName: 'Vikram Kulkarni',
    name: 'Vikram Kulkarni',
    primaryDiscipline: 'SOUND_DESIGNER',
    locationCity: 'Mumbai',
    availabilityStatus: 'AVAILABLE',
    skills: ['Logic Pro', 'QLab 5', 'Foley Sound', 'Spatial Audio'],
    profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop'
  },
  {
    id: 'demo-tech-4',
    fullName: 'Ananya Roy',
    name: 'Ananya Roy',
    primaryDiscipline: 'SOUND_OPERATOR',
    locationCity: 'Mumbai',
    availabilityStatus: 'AVAILABLE',
    skills: ['Yamaha CL5', 'Sennheiser Wireless', 'FOH Mixing', 'Microphone Patching'],
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop'
  },
  {
    id: 'demo-tech-5',
    fullName: 'Karan Joshi',
    name: 'Karan Joshi',
    primaryDiscipline: 'STAGE_MANAGER',
    locationCity: 'Mumbai',
    availabilityStatus: 'BOOKED',
    skills: ['Prompt Book', 'Cue Calling', 'Backstage Ops', 'Safety Protocols'],
    profileImageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop'
  }
];

export default function TalentPage() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [discipline, setDiscipline] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchTalent = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (discipline) params.set('role', discipline);
      if (location) params.set('location', location);
      if (availability) params.set('availability', availability);
      if (skillSearch) params.set('skills', skillSearch);
      params.set('page', String(page));
      params.set('limit', '9');
      const res = await fetch(`/api/talent?${params.toString()}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const list = data.technicians ?? data.data ?? [];
        if (list.length > 0) {
          setTechnicians(list);
          setMeta(data.pagination ?? { page, totalPages: 1, total: list.length });
          setLoading(false);
          return;
        }
      }

      let filtered = MOCK_TECHNICIANS;
      if (discipline) {
        filtered = filtered.filter(t => t.primaryDiscipline === discipline);
      }
      if (location) {
        filtered = filtered.filter(t => t.locationCity.toLowerCase().includes(location.toLowerCase()));
      }
      if (availability) {
        filtered = filtered.filter(t => t.availabilityStatus === availability);
      }
      if (skillSearch) {
        filtered = filtered.filter(t => t.skills.some(s => s.toLowerCase().includes(skillSearch.toLowerCase())));
      }
      setTechnicians(filtered);
      setMeta({ page: 1, totalPages: 1, total: filtered.length });
    } catch {
      let filtered = MOCK_TECHNICIANS;
      if (discipline) {
        filtered = filtered.filter(t => t.primaryDiscipline === discipline);
      }
      if (location) {
        filtered = filtered.filter(t => t.locationCity.toLowerCase().includes(location.toLowerCase()));
      }
      if (availability) {
        filtered = filtered.filter(t => t.availabilityStatus === availability);
      }
      if (skillSearch) {
        filtered = filtered.filter(t => t.skills.some(s => s.toLowerCase().includes(skillSearch.toLowerCase())));
      }
      setTechnicians(filtered);
      setMeta({ page: 1, totalPages: 1, total: filtered.length });
    } finally {
      setLoading(false);
    }
  }, [discipline, location, availability, skillSearch, page]);

  useEffect(() => {
    const t = setTimeout(fetchTalent, 250);
    return () => clearTimeout(t);
  }, [fetchTalent]);

  useEffect(() => {
    setPage(1);
  }, [discipline, location, availability, skillSearch]);

  const hasFilters = discipline || location || availability || skillSearch;

  return (
    <div className="min-h-screen">
      <section className="border-b-4 border-black bg-[#FF8FAB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <span className="nb-badge mb-4" style={{ background: '#fff' }}>🎬 Backstage Directory</span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase leading-none" style={{ textShadow: '4px 4px 0 #fff' }}>
            Discover Theatre Talent
          </h1>
          <p className="mt-4 font-bold max-w-xl">
            Browse {meta.total > 0 ? `${meta.total}` : 'skilled'} technicians &amp; designers across Mumbai and India — lights, sound, art, costume, stage and PR.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        <aside className="nb-card p-5 space-y-5 lg:sticky lg:top-28 bg-[#FFD60A]">
          <h2 className="font-black uppercase text-lg">🎛️ Filters</h2>

          <div>
            <label className="nb-label">Discipline</label>
            <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="nb-input cursor-pointer">
              <option value="">All Disciplines</option>
              {DISCIPLINES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="nb-label">Location</label>
            <input className="nb-input" placeholder="Mumbai, Andheri, Thane…" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div>
            <label className="nb-label">Availability</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setAvailability(o.value)}
                  className="nb-badge cursor-pointer !text-xs"
                  style={{ background: availability === o.value ? '#000' : '#fff', color: availability === o.value ? '#fff' : '#000' }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="nb-label">Skill</label>
            <input className="nb-input" placeholder="e.g. QLab 5, GrandMA3" value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} />
          </div>

          {hasFilters && (
            <button
              className="nb-btn nb-btn-white w-full !text-sm"
              onClick={() => { setDiscipline(''); setLocation(''); setAvailability(''); setSkillSearch(''); }}
            >
              Clear Filters
            </button>
          )}
        </aside>

        <div>
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="nb-card h-64 animate-pulse bg-[#eee]" />
              ))}
            </div>
          ) : technicians.length === 0 ? (
            <div className="nb-card p-12 text-center">
              <div className="text-6xl mb-3">🔦</div>
              <h2 className="text-2xl font-black uppercase">No talent found</h2>
              <p className="font-semibold mt-2">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {technicians.map((t) => (
                  <TechnicianCard key={t.id} tech={t} />
                ))}
              </div>
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="nb-btn nb-btn-white">← Prev</button>
                  <span className="font-extrabold uppercase text-sm">Page {meta.page} / {meta.totalPages}</span>
                  <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="nb-btn nb-btn-white">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
