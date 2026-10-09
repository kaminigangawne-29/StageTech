'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Role = 'TECHNICIAN' | 'PRODUCTION';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('TECHNICIAN');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'TECHNICIAN' || roleParam === 'PRODUCTION') setRole(roleParam);
  }, [searchParams]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Name is required.';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const isGithubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
      if (isGithubPages) {
        const cleanEmail = email.trim().toLowerCase();
        const newUser = {
          name: name.trim(),
          email: cleanEmail,
          role: role,
        };

        let existingUsers: Array<{ name: string; email: string; role: string }> = [];
        try {
          const u = localStorage.getItem('stagetech_users');
          if (u) existingUsers = JSON.parse(u);
        } catch {}

        const index = existingUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
        if (index >= 0) {
          existingUsers[index] = newUser;
        } else {
          existingUsers.push(newUser);
        }
        localStorage.setItem('stagetech_users', JSON.stringify(existingUsers));

        const mockSession = {
          user: {
            id: `user-${Date.now()}`,
            name: name.trim(),
            email: cleanEmail,
            role: role,
          },
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem('stagetech_session', JSON.stringify(mockSession));
        window.dispatchEvent(new Event('stagetech_session_updated'));
        window.location.href = '/StageTech/dashboard';
        return;
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ general: data.message ?? data.error ?? 'Registration failed. Please try again.' });
      } else {
        router.push('/login?registered=true');
      }
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
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
        <p className="mt-2 font-bold text-sm">Take your spot in the wings.</p>
      </div>

      <div className="nb-card p-7">
        <h1 className="text-2xl font-black uppercase mb-1">Create account</h1>
        <p className="text-sm font-semibold mb-5">Join Mumbai’s backstage community.</p>

        {errors.general && (
          <p className="mb-4 border-2 border-black bg-[#FF8FAB] px-3 py-2 text-sm font-bold">{errors.general}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          {([
            ['TECHNICIAN', '🔦 Technician', '#FFD60A'],
            ['PRODUCTION', '🎬 Production House', '#C8B6FF'],
          ] as const).map(([val, label, color]) => (
            <button
              key={val}
              type="button"
              onClick={() => setRole(val)}
              className="border-4 border-black p-3 font-black uppercase text-xs transition-all"
              style={{
                background: role === val ? color : '#fff',
                boxShadow: role === val ? '4px 4px 0 #000' : 'none',
                transform: role === val ? 'translate(-2px,-2px)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="nb-label" htmlFor="name">{role === 'PRODUCTION' ? 'Company name' : 'Full name'}</label>
            <input id="name" className="nb-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'PRODUCTION' ? 'Prithvi Players' : 'Aarav Mehta'} />
            {errors.name && <p className="mt-1 text-xs font-bold text-[#D00000]">{errors.name}</p>}
          </div>
          <div>
            <label className="nb-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="nb-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs font-bold text-[#D00000]">{errors.email}</p>}
          </div>
          <div>
            <label className="nb-label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} className="nb-input pr-16" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black uppercase">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs font-bold text-[#D00000]">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="nb-btn nb-btn-red w-full">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="text-center mt-5 text-sm font-bold">
        Already have an account? <Link href="/login" className="underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="nb-card p-8 font-black uppercase">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
