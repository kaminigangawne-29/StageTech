# 🎭 StageTech — Mumbai Theatre Backstage Talent Network

> A dedicated professional network and job marketplace tailored specifically for theatre and live-production backstage artists across Mumbai and India (Lighting, Sound, Stage Management, Set & Costume Design, and PR).

---

## 🌟 Key Features

- **Backstage Talent Directory**: Multi-craft directory separating designers (Lighting, Sound, Set, Costume) and live board operators with locality and venue matching (Prithvi, NCPA, Rangsharda, Shivaji Mandir).
- **Portfolio & Production History**: Upload plots, cue sheets, and production stills alongside a chronological timeline of past theatrical productions.
- **Crew Calls & Job Board**: Production houses can post crew calls with dates, budgets, locations, and required equipment proficiencies (ETC Eos, GrandMA, QLab, Yamaha CL/QL, etc.).
- **Application Pipeline**: Technicians can apply directly with cover letters; production teams can track and review applicants.
- **Direct Messaging**: Threaded in-app messaging between theatre producers and crew members.
- **Neobrutalist Theatre Design**: Distinctive visual design with stage curtains, animated spotlight beams, and marquee tickers.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS & Neobrutalist design tokens
- **Database & ORM**: SQLite & Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider with bcrypt password hashing)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & 22)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd stagetech

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-at-least-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client & push schema
npx prisma db push

# Seed sample Mumbai theatre data (venues, technicians, jobs)
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Production House** | `producer@prithviplayers.in` | `password123` |
| **Lighting Designer** | `aarav.lighting@example.com` | `password123` |
| **Sound Designer** | `meera.sound@example.com` | `password123` |
| **Production House** | `casting@rangmanch.in` | `password123` |

---

## 📄 License

MIT
