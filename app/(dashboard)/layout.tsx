'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  portfolio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  jobs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  messages: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  company: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  talent: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  postJob: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  signOut: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  logo: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 22,20 2,20" fill="#E63946" opacity="0.9" />
      <polygon points="12,6 19,18 5,18" fill="#FFF4D6" />
      <circle cx="12" cy="14" r="2" fill="#E63946" />
    </svg>
  ),
};

// ─── Role-based nav config ────────────────────────────────────────────────────
const TECHNICIAN_LINKS: NavLink[] = [
  { label: 'Dashboard',     href: '/dashboard',     icon: Icons.dashboard },
  { label: 'My Profile',    href: '/profile/edit',  icon: Icons.profile   },
  { label: 'Portfolio',     href: '/portfolio',     icon: Icons.portfolio },
  { label: 'History',       href: '/history',       icon: Icons.history   },
  { label: 'Browse Jobs',   href: '/jobs',          icon: Icons.jobs      },
  { label: 'Messages',      href: '/messages',      icon: Icons.messages  },
];

const PRODUCTION_LINKS: NavLink[] = [
  { label: 'Dashboard',     href: '/dashboard',          icon: Icons.dashboard },
  { label: 'Company',       href: '/company',            icon: Icons.company   },
  { label: 'Find Talent',   href: '/talent',             icon: Icons.talent    },
  { label: 'Post Job',      href: '/dashboard/jobs/new', icon: Icons.postJob   },
  { label: 'My Jobs',       href: '/dashboard/jobs',     icon: Icons.jobs      },
  { label: 'Messages',      href: '/messages',           icon: Icons.messages  },
];

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    TECHNICIAN: 'bg-red-600/20 text-red-600 border border-red-600/30',
    PRODUCTION: 'bg-amber-600/20 text-amber-600 border border-amber-600/30',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[role] ?? 'bg-gray-700 text-gray-300'}`}>
      {role}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function FullScreenSpinner() {
  return (
    <div
      style={{ background: '#FFF4D6' }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#111111', borderTopColor: '#E63946' }}
        />
        <p style={{ color: '#444444' }} className="text-sm">Loading StageTech…</p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  links,
  userName,
  userRole,
  pathname,
}: {
  links: NavLink[];
  userName: string;
  userRole: string;
  pathname: string;
}) {
  return (
    <aside
      style={{
        background: '#FFFFFF',
        borderRight: '4px solid #000',
        width: '256px',
        top: '82px',
        height: 'calc(100vh - 82px)',
      }}
      className="fixed left-0 flex flex-col z-40"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: '1px solid #111111' }}
      >
        {Icons.logo}
        <div>
          <span className="text-black font-bold text-lg tracking-tight">Stage</span>
          <span style={{ color: '#E63946' }} className="font-bold text-lg tracking-tight">Tech</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              style={
                isActive
                  ? {
                      background: 'rgba(230,57,70,0.12)',
                      color: '#E63946',
                      borderLeft: '3px solid #E63946',
                    }
                  : {
                      color: '#444444',
                      borderLeft: '3px solid transparent',
                    }
              }
              className="flex items-center gap-3 px-3 py-2.5 rounded-r-lg mb-1 text-sm font-medium transition-all duration-150 hover:bg-black/5 hover:text-black"
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div
        className="px-4 py-4 flex flex-col gap-3"
        style={{ borderTop: '1px solid #111111' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'rgba(230,57,70,0.2)', color: '#E63946' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-black text-sm font-medium truncate">{userName}</p>
            <RoleBadge role={userRole} />
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            background: 'rgba(208,0,0,0.1)',
            border: '1px solid rgba(208,0,0,0.25)',
            color: '#D00000',
          }}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
        >
          {Icons.signOut}
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <FullScreenSpinner />;
  }

  if (!session) {
    return null;
  }

  const role = (session.user as { role?: string })?.role ?? 'TECHNICIAN';
  const userName = session.user?.name ?? session.user?.email ?? 'User';
  const navLinks = role === 'PRODUCTION' ? PRODUCTION_LINKS : TECHNICIAN_LINKS;

  return (
    <div style={{ background: '#FFF4D6', minHeight: '100vh' }} className="flex">
      <Sidebar
        links={navLinks}
        userName={userName}
        userRole={role}
        pathname={pathname ?? ''}
      />
      <main
        className="flex-1 p-8 overflow-y-auto"
        style={{ marginLeft: '256px', minHeight: '100vh' }}
      >
        {children}
      </main>
    </div>
  );
}
