'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const InboxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
}) {
  return (
    <div
      style={{ background: '#FFFFFF', border: '1px solid #111111' }}
      className="rounded-xl p-5 flex items-center gap-4 flex-1"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}18`, color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <p style={{ color: '#444444' }} className="text-sm">
          {label}
        </p>
        <p className="text-black text-2xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────
function ActionCard({
  icon,
  title,
  description,
  href,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  accentColor: string;
}) {
  return (
    <Link
      href={href}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${accentColor}30`,
      }}
      className="rounded-xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-150 cursor-pointer group"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${accentColor}18`, color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-black font-semibold text-sm">{title}</p>
        <p style={{ color: '#444444' }} className="text-xs mt-0.5">
          {description}
        </p>
      </div>
      <div
        className="text-xs font-medium mt-auto flex items-center gap-1"
        style={{ color: accentColor }}
      >
        Go →
      </div>
    </Link>
  );
}

// ─── Activity Item ────────────────────────────────────────────────────────────
function ActivityItem({ icon, text, time }: { icon: React.ReactNode; text: string; time: string }) {
  return (
    <li
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: '1px solid #111111' }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(230,57,70,0.12)', color: '#E63946' }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-black text-sm">{text}</p>
        <p style={{ color: '#444444' }} className="text-xs mt-0.5">
          {time}
        </p>
      </div>
    </li>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-black font-semibold text-lg mb-4 flex items-center gap-2">
      <span style={{ width: '3px', height: '18px', background: '#E63946', borderRadius: '2px', display: 'inline-block' }} />
      {title}
    </h2>
  );
}

// ─── Technician Dashboard ─────────────────────────────────────────────────────
function TechnicianDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-black text-3xl font-bold">
          Welcome back, <span style={{ color: '#E63946' }}>{name}</span>! 👋
        </h1>
        <p style={{ color: '#444444' }} className="mt-1 text-sm">
          Here's what's happening with your profile today.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <StatCard icon={<EyeIcon />} label="Profile Views" value={0} accentColor="#E63946" />
        <StatCard icon={<SendIcon />} label="Applications Sent" value={0} accentColor="#FFB703" />
        <StatCard icon={<InboxIcon />} label="Unread Messages" value={0} accentColor="#1B9E5A" />
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-3 gap-4">
          <ActionCard
            icon={<EditIcon />}
            title="Edit Profile"
            description="Update your skills and availability"
            href="/profile/edit"
            accentColor="#E63946"
          />
          <ActionCard
            icon={<PlusIcon />}
            title="Add Portfolio Item"
            description="Showcase your latest work"
            href="/portfolio"
            accentColor="#FFB703"
          />
          <ActionCard
            icon={<SearchIcon />}
            title="Browse Jobs"
            description="Find your next production"
            href="/jobs"
            accentColor="#1B9E5A"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionHeader title="Recent Activity" />
        <div
          style={{ background: '#FFFFFF', border: '1px solid #111111' }}
          className="rounded-xl px-5 py-2"
        >
          <ul>
            <ActivityItem
              icon={<ActivityIcon />}
              text="Your profile was viewed by a production company"
              time="Just now"
            />
            <ActivityItem
              icon={<ActivityIcon />}
              text="New job posted matching your discipline"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<ActivityIcon />}
              text="Profile completion reminder — add your portfolio!"
              time="Yesterday"
            />
          </ul>
          <p
            style={{ color: '#444444' }}
            className="text-xs text-center py-3 italic"
          >
            Showing placeholder activity. Real-time tracking coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Production Dashboard ─────────────────────────────────────────────────────
function ProductionDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-black text-3xl font-bold">
          Welcome back, <span style={{ color: '#FFB703' }}>{name}</span>! 🎭
        </h1>
        <p style={{ color: '#444444' }} className="mt-1 text-sm">
          Manage your productions and discover talented crew.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <StatCard icon={<BriefcaseIcon />} label="Jobs Posted" value={0} accentColor="#FFB703" />
        <StatCard icon={<InboxIcon />} label="Applications Received" value={0} accentColor="#E63946" />
        <StatCard icon={<HeartIcon />} label="Saved Talent" value={0} accentColor="#1B9E5A" />
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-3 gap-4">
          <ActionCard
            icon={<PlusIcon />}
            title="Post a Job"
            description="Find the perfect crew member"
            href="/jobs/new"
            accentColor="#FFB703"
          />
          <ActionCard
            icon={<UsersIcon />}
            title="Find Talent"
            description="Browse skilled technicians"
            href="/talent"
            accentColor="#E63946"
          />
          <ActionCard
            icon={<MessageIcon />}
            title="View Messages"
            description="Connect with applicants"
            href="/messages"
            accentColor="#1B9E5A"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionHeader title="Recent Activity" />
        <div
          style={{ background: '#FFFFFF', border: '1px solid #111111' }}
          className="rounded-xl px-5 py-2"
        >
          <ul>
            <ActivityItem
              icon={<ActivityIcon />}
              text="A technician applied to your open role"
              time="Just now"
            />
            <ActivityItem
              icon={<ActivityIcon />}
              text="Your job listing has been viewed 12 times"
              time="1 hour ago"
            />
            <ActivityItem
              icon={<ActivityIcon />}
              text="Reminder: complete your company profile"
              time="Yesterday"
            />
          </ul>
          <p
            style={{ color: '#444444' }}
            className="text-xs text-center py-3 italic"
          >
            Showing placeholder activity. Real-time tracking coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();

  const role = (session?.user as { role?: string })?.role ?? 'TECHNICIAN';
  const name = session?.user?.name ?? session?.user?.email ?? 'there';

  return role === 'PRODUCTION' ? (
    <ProductionDashboard name={name} />
  ) : (
    <TechnicianDashboard name={name} />
  );
}
