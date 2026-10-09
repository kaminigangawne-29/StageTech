'use client';
import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stagetech_session');
      if (saved) {
        try {
          setSession(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/StageTech')
    ? '/StageTech/api/auth'
    : '/api/auth';

  return (
    <SessionProvider
      session={session}
      basePath={basePath}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
