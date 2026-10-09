import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { disciplineLabel, disciplineColor } from '@/lib/disciplines';
import ApplyForm from '@/components/ApplyForm';

export const dynamic = 'auto';

export async function generateStaticParams() {
  const mockIds = ['demo', 'demo-job-1', 'demo-job-2', 'demo-job-3', 'demo-job-4', 'demo-job-5', 'demo-job-6'];
  try {
    const jobs = await prisma.jobPosting.findMany({ select: { id: true } });
    if (jobs && jobs.length > 0) {
      const dbIds = jobs.map((j) => ({ id: j.id }));
      const all = [...dbIds, ...mockIds.map((id) => ({ id }))];
      return all;
    }
  } catch {
    // fallback
  }
  return mockIds.map((id) => ({ id }));
}

function fmt(d?: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function parseSkills(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  let rawJob = null;
  try {
    rawJob = await prisma.jobPosting.findUnique({
      where: { id: params.id },
      include: {
        company: { select: { id: true, companyName: true, description: true, website: true, location: true, logoUrl: true, userId: true } },
      },
    });
  } catch {
    // DB query error fallback
  }

  const mockJobsMap: Record<string, any> = {
    'demo-job-1': {
      id: 'demo-job-1',
      title: 'Senior Stage Lighting Designer',
      roleNeeded: 'LIGHTING_DESIGNER',
      status: 'OPEN',
      location: 'Prithvi Theatre, Juhu, Mumbai',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-30'),
      budget: '₹3,500 / day',
      description: 'Seeking an experienced Lighting Designer to design lights and atmosphere for a 15-day production run of a contemporary Hindi drama at Prithvi Theatre.',
      skillsRequired: JSON.stringify(['GrandMA3', 'QLab 5', 'DMX Protocol', 'Vectorworks']),
      company: { id: 'c1', companyName: 'Prithvi Players', description: 'Leading theatre production house in Mumbai.', website: 'https://prithvitheatre.org', location: 'Mumbai', logoUrl: null, userId: 'prod-demo' }
    },
    'demo-job-2': {
      id: 'demo-job-2',
      title: 'Lead Lighting Board Operator',
      roleNeeded: 'LIGHTING_OPERATOR',
      status: 'OPEN',
      location: 'NCPA, Nariman Point, Mumbai',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-15'),
      budget: '₹3,000 / day',
      description: 'Operating GrandMA3 console live during show runs, executing lighting cues and maintaining stage fixtures.',
      skillsRequired: JSON.stringify(['ETC Ion', 'DMX Patching', 'Moving Heads']),
      company: { id: 'c2', companyName: 'Royal Stage Productions', description: 'Renowned production company producing grand stage shows.', website: 'https://ncpamumbai.com', location: 'Mumbai', logoUrl: null, userId: 'prod-demo-2' }
    },
    'demo-job-3': {
      id: 'demo-job-3',
      title: 'Sound Designer & Audio Producer',
      roleNeeded: 'SOUND_DESIGNER',
      status: 'OPEN',
      location: 'Royal Opera House, Mumbai',
      startDate: new Date('2026-11-05'),
      endDate: new Date('2026-11-20'),
      budget: '₹40,000 fixed',
      description: 'Composing soundscapes, atmospheric audio, and cueing sound effects for a major theatre musical production.',
      skillsRequired: JSON.stringify(['Logic Pro', 'QLab 5', 'Spatial Audio']),
      company: { id: 'c3', companyName: 'Drama Circle Mumbai', description: 'Experimental and classical drama group.', website: 'https://dramacircle.in', location: 'Mumbai', logoUrl: null, userId: 'prod-demo-3' }
    },
    'demo-job-4': {
      id: 'demo-job-4',
      title: 'Live Sound Operator & FOH Engineer',
      roleNeeded: 'SOUND_OPERATOR',
      status: 'OPEN',
      location: 'Andheri West, Mumbai',
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-11-05'),
      budget: '₹3,800 / day',
      description: 'Live audio mixing and QLab playback for musical theatre performance. Experience with Yamaha digital consoles required.',
      skillsRequired: JSON.stringify(['Yamaha CL5', 'Sennheiser Wireless', 'FOH Mixing']),
      company: { id: 'c4', companyName: 'The Wings Collective', description: 'Contemporary theatre production house.', website: 'https://wingscollective.in', location: 'Mumbai', logoUrl: null, userId: 'prod-demo-4' }
    },
    'demo-job-5': {
      id: 'demo-job-5',
      title: 'Stage Manager & Cue Caller',
      roleNeeded: 'STAGE_MANAGER',
      status: 'OPEN',
      location: 'Bandra, Mumbai',
      startDate: new Date('2026-10-25'),
      endDate: new Date('2026-11-10'),
      budget: '₹3,200 / day',
      description: 'Calling lighting & sound cues, managing backstage props, actor transitions, and maintaining prompt book.',
      skillsRequired: JSON.stringify(['Prompt Book', 'Cue Calling', 'Backstage Ops']),
      company: { id: 'c5', companyName: 'Kala Studio', description: 'Experimental theatre studio in Bandra.', website: 'https://kalastudio.in', location: 'Mumbai', logoUrl: null, userId: 'prod-demo-5' }
    },
    'demo-job-6': {
      id: 'demo-job-6',
      title: 'Set & Prop Designer',
      roleNeeded: 'SET_DESIGNER',
      status: 'OPEN',
      location: 'Dadar, Mumbai',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-25'),
      budget: '₹50,000 fixed',
      description: 'Designing and supervising construction of realistic set pieces for black-box theatre.',
      skillsRequired: JSON.stringify(['SketchUp', 'Prop Fabrication', 'Scenic Painting']),
      company: { id: 'c6', companyName: 'Mumbai Theatre Group', description: 'Prominent theatre group in Central Mumbai.', website: 'https://mumbaitheatre.org', location: 'Mumbai', logoUrl: null, userId: 'prod-demo-6' }
    }
  };

  const defaultDemoJob = {
    id: params.id || 'demo',
    title: 'Senior Stage Lighting Designer',
    roleNeeded: 'LIGHTING_DESIGNER',
    status: 'OPEN',
    location: 'Prithvi Theatre, Juhu, Mumbai',
    startDate: new Date('2026-10-15'),
    endDate: new Date('2026-10-30'),
    budget: '₹3,500 / day',
    description: 'Seeking an experienced Lighting Designer to design lights and atmosphere for a 15-day production run of a contemporary Hindi drama at Prithvi Theatre.',
    skillsRequired: JSON.stringify(['GrandMA3', 'QLab 5', 'DMX Protocol']),
    company: { id: 'c1', companyName: 'Prithvi Players', description: 'Leading theatre production house in Mumbai.', website: 'https://prithvitheatre.org', location: 'Mumbai', logoUrl: null, userId: 'prod-demo' }
  };

  const demoJob = mockJobsMap[params.id] || defaultDemoJob;

  const job = rawJob || demoJob;

  const skills = parseSkills(job.skillsRequired);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/jobs" className="nb-btn nb-btn-white !py-1.5 !px-3 !text-xs mb-6">← All Jobs</Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="ticket p-6 sm:p-8" style={{ background: '#fff' }}>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="nb-badge" style={{ background: disciplineColor(job.roleNeeded) }}>
                  {disciplineLabel(job.roleNeeded)}
                </span>
                <span className="nb-badge" style={{ background: job.status === 'OPEN' ? '#7AE582' : '#E5E5E5' }}>
                  {job.status}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase leading-[1.05]">{job.title}</h1>
              <p className="mt-3 font-bold text-lg">at {job.company.companyName}</p>

              <div className="grid sm:grid-cols-3 gap-3 mt-6">
                <div className="border-2 border-black p-3 bg-[#FFF4D6]">
                  <div className="nb-label">📍 Location</div>
                  <div className="font-bold">{job.location || job.company.location || 'Mumbai'}</div>
                </div>
                <div className="border-2 border-black p-3 bg-[#FFF4D6]">
                  <div className="nb-label">📅 Dates</div>
                  <div className="font-bold">
                    {job.startDate ? fmt(job.startDate) : 'TBD'}
                    {job.endDate ? ` – ${fmt(job.endDate)}` : ''}
                  </div>
                </div>
                <div className="border-2 border-black p-3 bg-[#FFD60A]">
                  <div className="nb-label">💰 Budget</div>
                  <div className="font-black">{job.budget || 'On discussion'}</div>
                </div>
              </div>
            </div>

            <div className="nb-card p-6 sm:p-8">
              <h2 className="text-xl font-black uppercase mb-3">The Brief</h2>
              <p className="whitespace-pre-line leading-relaxed font-medium">{job.description}</p>

              {skills.length > 0 && (
                <>
                  <h3 className="text-sm font-black uppercase mt-6 mb-2">Skills needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="nb-tag">{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <ApplyForm jobId={job.id} jobTitle={job.title} status={job.status} />

            <div className="nb-card p-6 bg-[#C8B6FF]">
              <div className="nb-label">Production House</div>
              <h3 className="text-xl font-black uppercase">{job.company.companyName}</h3>
              {job.company.location && <p className="text-sm font-bold mt-1">📍 {job.company.location}</p>}
              {job.company.description && <p className="text-sm font-medium mt-3 leading-relaxed">{job.company.description}</p>}
              {job.company.website && (
                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-white !text-xs mt-4">
                  Visit website ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
