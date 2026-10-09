'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const registered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const isGithubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
      if (isGithubPages) {
        const isProd = email.toLowerCase().includes('producer');
        const mockUser = {
          id: isProd ? 'prod-demo' : 'tech-demo',
          name: isProd ? 'Prithvi Players' : (email.split('@')[0] || 'Aarav Sharma'),
          email: email.trim().toLowerCase(),
          role: isProd ? 'PRODUCTION' : 'TECHNICIAN',
        };
        const mockSession = {
          user: mockUser,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem('stagetech_session', JSON.stringify(mockSession));
        window.location.href = '/StageTech/dashboard';
        return;
      }

      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push(callbackUrl.startsWith('/') ? callbackUrl : '/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <Link href="/" className="inline-block text-3xl font-black uppercase">
          🎭 Stage<span className="bg-black text-[#FFD60A] px-1">Tech</span>
        </Link>
        <p className="mt-2 font-bold text-sm">Lights up. Curtain rising.</p>
      </div>

      <div className="nb-card p-7">
        <h1 className="text-2xl font-black uppercase mb-1">Welcome back</h1>
        <p className="text-sm font-semibold mb-5">Sign in to your StageTech account</p>

        {registered && (
          <p className="mb-4 border-2 border-black bg-[#7AE582] px-3 py-2 text-sm font-bold">Account created! Please sign in.</p>
        )}
        {error && <p className="mb-4 border-2 border-black bg-[#FF8FAB] px-3 py-2 text-sm font-bold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="nb-label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className="nb-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="nb-label" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" className="nb-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="nb-btn nb-btn-red w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-2 border-dashed border-black bg-[#FFD60A] p-3 text-xs font-bold">
          <div className="uppercase font-black mb-1">🎟️ Demo logins (password: password123)</div>
          <div>Technician: aarav.lighting@example.com</div>
          <div>Production: producer@prithviplayers.in</div>
        </div>
      </div>

      <p className="text-center mt-5 text-sm font-bold">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="nb-card p-8 font-black uppercase">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
