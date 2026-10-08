import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=400&auto=format&fit=crop&q=80`;
const STAGE = (id: string) => `https://images.unsplash.com/${id}?w=800&auto=format&fit=crop&q=80`;

async function main() {
  console.log('Seeding StageTech (Mumbai) database...');

  await prisma.message.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.savedTechnician.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.productionHistory.deleteMany();
  await prisma.technicianSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.productionCompany.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const skillNames = [
    'ETC Eos Family', 'GrandMA3', 'Vectorworks Spotlight', 'DMX / sACN / Art-Net', 'Lighting Design',
    'Cue Programming', 'QLab 5', 'Dante Audio Network', 'Yamaha CL/QL Consoles', 'Sound Design',
    'Ableton Live', 'Wireless Mic Coordination', 'Costume Construction', 'Period Costumes',
    'Set Design', 'AutoCAD 3D', 'Scenic Painting', 'Art Direction', 'Stage Management',
    'Cue Calling', 'Production Management', 'Public Relations', 'Press & Media Outreach',
    'Social Media Marketing', 'Audience Development',
  ];
  const skillMap: Record<string, string> = {};
  for (const name of skillNames) {
    const s = await prisma.skill.create({ data: { name } });
    skillMap[name] = s.id;
  }

  const technicians = [
    {
      name: 'Aarav Mehta', email: 'aarav.lighting@example.com', discipline: 'LIGHTING_DESIGNER',
      location: 'Andheri, Mumbai', availability: 'AVAILABLE', phone: '+91 98200 11111',
      imageUrl: IMG('photo-1507003211169-0a1dd7228f2d'),
      bio: 'Lighting designer with 8+ years painting sculptural, atmospheric looks for Hindi, Marathi and English productions across Prithvi, NCPA and Rangsharda.',
      skills: ['Lighting Design', 'Vectorworks Spotlight', 'ETC Eos Family', 'DMX / sACN / Art-Net'],
      portfolio: [
        { title: 'Macbeth – Dunsinane Act IV', description: 'Cold steel-blue sidelight with heavy haze.', mediaUrl: STAGE('photo-1507676184212-d03ab07a01bf'), mediaType: 'IMAGE' },
        { title: 'Lighting plot – The Cherry Orchard', description: 'Vectorworks plot and photometrics.', mediaUrl: STAGE('photo-1516450360452-9312f5e86fc7'), mediaType: 'IMAGE' },
      ],
      history: [
        { showTitle: 'Macbeth', company: 'Prithvi Theatre, Juhu', roleHeld: 'Lighting Designer', startDate: new Date('2025-09-01'), endDate: new Date('2025-12-15'), description: 'Designed a 120-fixture rig with moving heads and haze.' },
        { showTitle: 'Tamasha', company: 'NCPA, Nariman Point', roleHeld: 'Lighting Designer', startDate: new Date('2025-02-10'), endDate: new Date('2025-05-20'), description: 'Touring musical, 14 shows across Mumbai and Pune.' },
      ],
    },
    {
      name: 'Rohan Deshmukh', email: 'rohan.lightop@example.com', discipline: 'LIGHTING_OPERATOR',
      location: 'Dadar, Mumbai', availability: 'OPEN_TO_OFFERS', phone: '+91 98200 22222',
      bio: 'Reliable lighting board operator — ETC Eos and GrandMA3 — known for clean cue tracking under tight tech schedules.',
      skills: ['ETC Eos Family', 'GrandMA3', 'Cue Programming', 'DMX / sACN / Art-Net'],
      portfolio: [],
      history: [
        { showTitle: 'Sakharam Binder', company: 'Shivaji Mandir, Dadar', roleHeld: 'Lighting Operator', startDate: new Date('2025-07-01'), endDate: new Date('2025-09-30'), description: 'Ran 90+ cues nightly on ETC Ion.' },
      ],
    },
    {
      name: 'Meera Iyer', email: 'meera.sound@example.com', discipline: 'SOUND_DESIGNER',
      location: 'Bandra, Mumbai', availability: 'OPEN_TO_OFFERS', phone: '+91 98200 33333',
      imageUrl: IMG('photo-1534528741775-53994a69daeb'),
      bio: 'Theatrical sound designer composing immersive soundscapes, spatial audio and live Foley for contemporary Indian theatre.',
      skills: ['Sound Design', 'QLab 5', 'Ableton Live', 'Dante Audio Network'],
      portfolio: [
        { title: '1984 – Dynamic Soundscape', description: 'Surround score and Foley on redundant QLab machines.', mediaUrl: STAGE('photo-1598488035139-bdbb2231ce04'), mediaType: 'IMAGE' },
      ],
      history: [
        { showTitle: '1984 (Hindi adaptation)', company: 'Jamnabai Narsee Auditorium', roleHeld: 'Sound Designer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-30'), description: '16-channel immersive system with binaural elements.' },
      ],
    },
    {
      name: 'Imran Qureshi', email: 'imran.soundop@example.com', discipline: 'SOUND_OPERATOR',
      location: 'Borivali, Mumbai', availability: 'AVAILABLE', phone: '+91 98200 44444',
      bio: 'FOH mixer and sound operator — wireless mic coordination, live band mixing and QLab playback for long theatre runs.',
      skills: ['Yamaha CL/QL Consoles', 'QLab 5', 'Wireless Mic Coordination'],
      portfolio: [],
      history: [
        { showTitle: 'Gandhi Viruddh Gandhi', company: 'Bhaidas Hall, Vile Parle', roleHeld: 'Sound Operator', startDate: new Date('2025-03-01'), endDate: new Date('2025-06-15'), description: 'Mixed 12 RF channels nightly across 40 shows.' },
      ],
    },
    {
      name: 'Sophia D’Souza', email: 'sophia.costume@example.com', discipline: 'COSTUME_DESIGNER',
      location: 'Bandra, Mumbai', availability: 'AVAILABLE', phone: '+91 98200 55555',
      imageUrl: IMG('photo-1517841905240-472988babdf9'),
      bio: 'Costume designer for period and contemporary productions — sustainable fabric sourcing, hand-block prints and quick-change construction.',
      skills: ['Costume Construction', 'Period Costumes', 'Art Direction'],
      portfolio: [
        { title: 'Mughal-e-Azam stage wardrobe', description: 'Embroidered ensemble costumes with zardozi detailing.', mediaUrl: STAGE('photo-1490481651871-ab68de25d43d'), mediaType: 'IMAGE' },
      ],
      history: [
        { showTitle: 'Mughal-e-Azam: The Musical', company: 'NMACC, Bandra Kurla', roleHeld: 'Costume Designer', startDate: new Date('2025-01-15'), endDate: new Date('2025-04-30'), description: 'Designed and supervised 120 costumes.' },
      ],
    },
    {
      name: 'Karan Malhotra', email: 'karan.art@example.com', discipline: 'ART_DIRECTOR',
      location: 'Powai, Mumbai', availability: 'BOOKED', phone: '+91 98200 66666',
      imageUrl: IMG('photo-1500648767791-00dcc994a43e'),
      bio: 'Art director and set designer shaping the visual world of a production — from concept boards to scenic build.',
      skills: ['Art Direction', 'Set Design', 'AutoCAD 3D', 'Scenic Painting'],
      portfolio: [
        { title: 'Set model – The Crucible', description: 'Rotating deck concept with hydraulic traps.', mediaUrl: STAGE('photo-1460723237483-7a6dc9d0b212'), mediaType: 'IMAGE' },
      ],
      history: [
        { showTitle: 'The Crucible', company: 'Prithvi Theatre, Juhu', roleHeld: 'Art Director', startDate: new Date('2024-10-01'), endDate: new Date('2025-03-01'), description: 'Led a build crew of 15.' },
      ],
    },
    {
      name: 'Neha Kulkarni', email: 'neha.stage@example.com', discipline: 'STAGE_MANAGER',
      location: 'Thane, Mumbai', availability: 'AVAILABLE', phone: '+91 98200 77777',
      bio: 'Stage manager with 10 years of experience calling shows, managing backstage crews and keeping rehearsals on time.',
      skills: ['Stage Management', 'Cue Calling', 'Production Management'],
      portfolio: [],
      history: [
        { showTitle: 'Ghashiram Kotwal', company: 'Yashwantrao Chavan Natyagruha', roleHeld: 'Stage Manager', startDate: new Date('2025-04-01'), endDate: new Date('2025-07-01'), description: 'Called 400+ cues across 40 performances.' },
      ],
    },
    {
      name: 'Pooja Shah', email: 'pooja.pr@example.com', discipline: 'PUBLIC_RELATIONS',
      location: 'Juhu, Mumbai', availability: 'OPEN_TO_OFFERS', phone: '+91 98200 88888',
      bio: 'Theatre PR and audience-development specialist — press outreach, critic invites, social campaigns and sold-out opening weekends.',
      skills: ['Public Relations', 'Press & Media Outreach', 'Social Media Marketing', 'Audience Development'],
      portfolio: [],
      history: [
        { showTitle: 'Mumbai Theatre Festival', company: 'NCPA, Nariman Point', roleHeld: 'PR Lead', startDate: new Date('2025-08-01'), endDate: new Date('2025-09-15'), description: 'Secured coverage in 12 national publications.' },
      ],
    },
  ];

  for (const t of technicians) {
    const user = await prisma.user.create({
      data: { name: t.name, email: t.email, password: hashedPassword, role: 'TECHNICIAN' },
    });
    const profile = await prisma.technicianProfile.create({
      data: {
        userId: user.id,
        fullName: t.name,
        bio: t.bio,
        locationCity: t.location,
        primaryDiscipline: t.discipline,
        availabilityStatus: t.availability,
        profileImageUrl: (t as any).imageUrl ?? null,
        phone: t.phone,
      },
    });
    for (const s of t.skills) {
      await prisma.technicianSkill.create({ data: { technicianId: profile.id, skillId: skillMap[s] } });
    }
    for (const p of t.portfolio) {
      await prisma.portfolioItem.create({ data: { technicianId: profile.id, ...p } });
    }
    for (const h of t.history) {
      await prisma.productionHistory.create({ data: { technicianId: profile.id, ...h } });
    }
  }

  const companies = [
    {
      name: 'Prithvi Players', email: 'producer@prithviplayers.in',
      description: 'Mumbai repertory company producing classic and contemporary drama in Hindi, English and Marathi.',
      location: 'Juhu, Mumbai', website: 'https://prithviplayers.example.com',
      logoUrl: STAGE('photo-1460723237483-7a6dc9d0b212'),
      jobs: [
        { title: 'Lighting Operator – Autumn Season', description: 'Need an experienced ETC Eos operator for a 7-week rehearsal and performance block at Prithvi Theatre. Must be comfortable with tight tech schedules and cue tracking.', roleNeeded: 'LIGHTING_OPERATOR', startDate: new Date('2026-11-01'), endDate: new Date('2026-12-22'), budget: '₹2,500 per show', location: 'Juhu, Mumbai', skillsRequired: '["ETC Eos Family","Cue Programming"]' },
        { title: 'Lighting Designer – New Hindi Original', description: 'We are staging a new original play and need a Lighting Designer to build the look from the first run-through to opening night.', roleNeeded: 'LIGHTING_DESIGNER', startDate: new Date('2026-12-05'), endDate: new Date('2027-01-20'), budget: '₹60,000 total', location: 'Juhu, Mumbai', skillsRequired: '["Lighting Design","Vectorworks Spotlight"]' },
        { title: 'Sound Operator – QLab & Live Band', description: 'Mix a 5-piece onstage band and 10 wireless mics, with QLab playback, across a month-long run.', roleNeeded: 'SOUND_OPERATOR', startDate: new Date('2026-11-15'), endDate: new Date('2027-01-10'), budget: '₹2,200 per show', location: 'Juhu, Mumbai', skillsRequired: '["Yamaha CL/QL Consoles","QLab 5"]' },
      ],
    },
    {
      name: 'Rangmanch Productions', email: 'casting@rangmanch.in',
      description: 'Commercial theatre producers staging large-scale Hindi musicals and touring productions across Maharashtra.',
      location: 'Andheri, Mumbai', website: 'https://rangmanch.example.com',
      logoUrl: STAGE('photo-1514306191717-452ec28c7814'),
      jobs: [
        { title: 'Sound Designer – Musical Theatre', description: 'Design the sound for a new musical: live mix concept, playback cues and sound effects.', roleNeeded: 'SOUND_DESIGNER', startDate: new Date('2026-12-01'), endDate: new Date('2027-02-28'), budget: '₹75,000 total', location: 'Andheri, Mumbai', skillsRequired: '["Sound Design","QLab 5"]' },
        { title: 'Costume Designer – Period Drama', description: 'Design and supervise wardrobe for a 22-actor period production.', roleNeeded: 'COSTUME_DESIGNER', startDate: new Date('2026-12-01'), endDate: new Date('2027-03-15'), budget: '₹80,000 + build budget', location: 'Andheri, Mumbai', skillsRequired: '["Costume Construction","Period Costumes"]' },
        { title: 'Public Relations Lead – Season Launch', description: 'Own press, critic outreach and social campaigns for our spring season launch in Mumbai.', roleNeeded: 'PUBLIC_RELATIONS', startDate: new Date('2027-01-10'), endDate: new Date('2027-03-31'), budget: '₹45,000 per month', location: 'Bandra, Mumbai', skillsRequired: '["Public Relations","Social Media Marketing"]' },
      ],
    },
  ];

  for (const c of companies) {
    const user = await prisma.user.create({
      data: { name: c.name, email: c.email, password: hashedPassword, role: 'PRODUCTION' },
    });
    const company = await prisma.productionCompany.create({
      data: { userId: user.id, companyName: c.name, description: c.description, location: c.location, website: c.website, logoUrl: c.logoUrl },
    });
    for (const j of c.jobs) {
      await prisma.jobPosting.create({ data: { companyId: company.id, status: 'OPEN', ...j } });
    }
  }

  console.log('Seeding completed! All users have password: password123');
  console.log('  Technician: aarav.lighting@example.com');
  console.log('  Production: producer@prithviplayers.in');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
