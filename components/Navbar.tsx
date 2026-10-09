'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [staticSession, setStaticSession] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      const getSession = () => {
        try {
          const s = localStorage.getItem('stagetech_session');
          setStaticSession(s ? JSON.parse(s) : null);
        } catch {
          setStaticSession(null);
        }
      };
      getSession();
      window.addEventListener('stagetech_session_updated', getSession);
      window.addEventListener('storage', getSession);
      return () => {
        window.removeEventListener('stagetech_session_updated', getSession);
        window.removeEventListener('storage', getSession);
      };
    }
  }, []);

  const currentSession = session || staticSession;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Talent', href: '/talent' },
    { label: 'Jobs', href: '/jobs' },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="marquee-lights bg-black" />
      <nav className="w-full bg-[#FFD60A] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 select-none wiggle">
              <span className="w-9 h-9 bg-black text-[#FFD60A] border-2 border-black flex items-center justify-center text-xl" aria-hidden>
                🎭
              </span>
              <span className="text-2xl font-black tracking-tight uppercase text-black">
                Stage<span className="bg-black text-[#FFD60A] px-1 ml-0.5">Tech</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-extrabold uppercase px-3 py-1.5 border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0_#000] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {status === 'loading' && !staticSession ? (
                <div className="w-24 h-9 bg-white border-2 border-black animate-pulse" />
              ) : currentSession ? (
                <>
                  <Link href="/dashboard" className="nb-btn nb-btn-white !py-1.5 !px-4 !text-sm">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
                        localStorage.removeItem('stagetech_session');
                        window.dispatchEvent(new Event('stagetech_session_updated'));
                        window.location.href = '/StageTech';
                        return;
                      }
                      signOut({ callbackUrl: '/' });
                    }}
                    className="nb-btn nb-btn-red !py-1.5 !px-4 !text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nb-btn nb-btn-white !py-1.5 !px-4 !text-sm">
                    Sign In
                  </Link>
                  <Link href="/signup" className="nb-btn nb-btn-red !py-1.5 !px-4 !text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-white border-2 border-black shadow-[3px_3px_0_#000]"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-5 bg-black transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-black transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-black transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t-4 border-black bg-white px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-extrabold uppercase text-sm"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t-2 border-black pt-3 flex flex-col gap-3">
              {currentSession ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="nb-btn nb-btn-white">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
                        localStorage.removeItem('stagetech_session');
                        window.dispatchEvent(new Event('stagetech_session_updated'));
                        window.location.href = '/StageTech';
                        return;
                      }
                      signOut({ callbackUrl: '/' });
                    }}
                    className="nb-btn nb-btn-red"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="nb-btn nb-btn-white">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="nb-btn nb-btn-red">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
