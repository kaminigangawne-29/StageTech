import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { disciplineLabel, disciplineColor } from '@/lib/disciplines';
import InquiryButton from '@/components/InquiryButton';

export const dynamic = 'auto';

export async function generateStaticParams() {
  try {
    const profiles = await prisma.technicianProfile.findMany({ select: { id: true } });
    if (profiles && profiles.length > 0) {
      return profiles.map((p) => ({ id: p.id }));
    }
  } catch {
    // fallback for static export without DB
  }
  return [{ id: 'demo' }];
}

const AVAIL: Record<string, { bg: string; label: string }> = {
  AVAILABLE: { bg: '#7AE582', label: 'Available' },
  OPEN_TO_OFFERS: { bg: '#FFD60A', label: 'Open to offers' },
  BOOKED: { bg: '#FF8FAB', label: 'Booked' },
};

function fmt(d?: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
}

function Section({ title, color = '#fff', children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="nb-card p-6" style={{ background: color }}>
      <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-2">{title}</h2>
      {children}
    </div>
  );
}

export default async function TechnicianProfilePage({ params }: { params: { id: string } }) {
  let rawProfile = null;
  try {
    rawProfile = await prisma.technicianProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, email: true } },
        skills: { include: { skill: true } },
        portfolioItems: { orderBy: { sortOrder: 'asc' } },
        productionHistory: { orderBy: { startDate: 'desc' } },
      },
    });
  } catch {
    // DB query error fallback
  }

  const demoProfile = {
    id: params.id || 'demo',
    userId: 'demo-user',
    fullName: 'Aarav Mehta',
    primaryDiscipline: 'LIGHTING',
    locationCity: 'Mumbai',
    availabilityStatus: 'AVAILABLE',
    profileImageUrl: null,
    bio: 'Experienced Lighting Designer & Programmer with 7+ years in Mumbai theatre productions.',
    phone: '+91 98765 43210',
    websiteUrl: 'https://stagetech.demo',
    user: { id: 'demo-user', email: 'aarav.lighting@example.com' },
    skills: [
      { skill: { name: 'GrandMA3' } },
      { skill: { name: 'QLab 5' } },
      { skill: { name: 'Rigging' } },
    ],
    portfolioItems: [
      { id: 'p1', title: 'Prithvi Theatre Lighting', description: 'Full stage lighting design for 30-day run.', mediaType: 'IMAGE', mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop', sortOrder: 1 }
    ],
    productionHistory: [
      { id: 'h1', showTitle: 'Mughal-e-Azam Musical', company: 'NCPA Mumbai', roleHeld: 'Lead Lighting Tech', startDate: new Date('2023-01-01'), endDate: new Date('2023-06-01'), description: 'Managed grand stage lighting setup.' }
    ]
  };

  const profile = rawProfile || demoProfile;

  const avail = AVAIL[(profile.availabilityStatus || 'AVAILABLE').toUpperCase()] || AVAIL.AVAILABLE;
  const skills = profile.skills.map((s) => s.skill.name);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <Link href="/talent" className="nb-btn nb-btn-white !py-1.5 !px-3 !text-xs">
          ← Back to Talent Directory
        </Link>
      </div>
      {/* Banner */}
      <section className="border-b-4 border-black relative overflow-hidden" style={{ background: disciplineColor(profile.primaryDiscipline) }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-wrap items-center gap-6">
          {profile.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.profileImageUrl} alt={profile.fullName} className="w-32 h-32 object-cover border-4 border-black shadow-[6px_6px_0_#000]" />
          ) : (
            <div className="w-32 h-32 bg-white border-4 border-black shadow-[6px_6px_0_#000] flex items-center justify-center text-5xl font-black">
              {initials(profile.fullName)}
            </div>
          )}
          <div className="flex-1 min-w-[240px]">
            <Link href="/talent" className="nb-badge mb-3" style={{ background: '#fff' }}>← Directory</Link>
            <h1 className="text-4xl sm:text-6xl font-black uppercase leading-none">{profile.fullName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="nb-badge" style={{ background: '#000', color: '#fff' }}>{disciplineLabel(profile.primaryDiscipline)}</span>
              <span className="nb-badge" style={{ background: '#fff' }}>📍 {profile.locationCity || 'Mumbai'}</span>
              <span className="nb-badge" style={{ background: avail.bg }}>{avail.label}</span>
            </div>
          </div>
          <div>
            <InquiryButton receiverUserId={profile.userId} techName={profile.fullName} />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
        {/* Left */}
        <div className="space-y-6">
          {profile.bio && (
            <Section title="About">
              <p className="leading-relaxed font-medium">{profile.bio}</p>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills & Tools" color="#C8B6FF">
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="nb-tag" style={{ background: '#fff' }}>{s}</span>
                ))}
              </div>
            </Section>
          )}

          <Section title="Contact" color="#FFD60A">
            <div className="space-y-2 font-bold text-sm">
              {profile.user?.email && (
                <div>✉️ <a className="underline" href={`mailto:${profile.user.email}`}>{profile.user.email}</a></div>
              )}
              {profile.phone && <div>📞 <a className="underline" href={`tel:${profile.phone}`}>{profile.phone}</a></div>}
              {profile.websiteUrl && (
                <div>🌐 <a className="underline" href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">{profile.websiteUrl.replace(/^https?:\/\//, '')}</a></div>
              )}
            </div>
          </Section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {profile.portfolioItems.length > 0 && (
            <Section title="Portfolio">
              <div className="grid sm:grid-cols-2 gap-4">
                {profile.portfolioItems.map((p) => {
                  const body = (
                    <div className="border-4 border-black bg-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_#000] transition-all">
                      {p.mediaType === 'IMAGE' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.mediaUrl} alt={p.title} className="w-full h-36 object-cover border-b-4 border-black" />
                      ) : (
                        <div className="w-full h-36 flex items-center justify-center text-5xl bg-[#FFB703] border-b-4 border-black">
                          {p.mediaType === 'VIDEO' ? '🎬' : p.mediaType === 'PDF' ? '📄' : '🔗'}
                        </div>
                      )}
                      <div className="p-3">
                        <div className="font-black text-sm uppercase">{p.title}</div>
                        {p.description && <div className="text-xs font-medium mt-1 line-clamp-2">{p.description}</div>}
                      </div>
                    </div>
                  );
                  return p.mediaType === 'IMAGE' ? (
                    <div key={p.id}>{body}</div>
                  ) : (
                    <a key={p.id} href={p.mediaUrl} target="_blank" rel="noopener noreferrer">{body}</a>
                  );
                })}
              </div>
            </Section>
          )}

          {profile.productionHistory.length > 0 && (
            <Section title="Production History 🎭">
              <div className="space-y-4">
                {profile.productionHistory.map((h, i) => (
                  <div key={h.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 border-4 border-black" style={{ background: i === 0 ? '#E63946' : '#FFD60A' }} />
                      <div className="flex-1 w-1 bg-black" />
                    </div>
                    <div className="pb-2">
                      <div className="font-black uppercase">{h.showTitle}</div>
                      <div className="text-sm font-bold">{h.company}</div>
                      <div className="flex flex-wrap gap-2 mt-1 items-center">
                        <span className="nb-tag" style={{ background: '#FFD60A' }}>{h.roleHeld}</span>
                        <span className="text-xs font-bold">{fmt(h.startDate)}{h.endDate ? ` – ${fmt(h.endDate)}` : ''}</span>
                      </div>
                      {h.description && <p className="text-sm font-medium mt-2">{h.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
