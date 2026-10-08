'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ApplyForm({ jobId, jobTitle, status }: { jobId: string; jobTitle: string; status: string }) {
  const { data: session, status: authStatus } = useSession();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const role = (session?.user as { role?: string } | undefined)?.role;

  if (status !== 'OPEN') {
    return (
      <div className="nb-card p-6 bg-[#E5E5E5]">
        <p className="font-extrabold uppercase">This position is {status.toLowerCase()}.</p>
        <p className="text-sm mt-1">Applications are no longer being accepted.</p>
      </div>
    );
  }

  if (authStatus === 'loading') {
    return <div className="nb-card p-6 animate-pulse h-40" />;
  }

  if (!session) {
    return (
      <div className="nb-card p-6 bg-[#FFD60A]">
        <h3 className="text-xl font-black uppercase mb-2">🎟️ Want this gig?</h3>
        <p className="text-sm font-semibold mb-4">Sign in as a technician to apply for “{jobTitle}”.</p>
        <div className="flex gap-3 flex-wrap">
          <Link href={`/login?callbackUrl=/jobs/${jobId}`} className="nb-btn nb-btn-white">Sign In</Link>
          <Link href="/signup?role=technician" className="nb-btn nb-btn-red">Join as Talent</Link>
        </div>
      </div>
    );
  }

  if (role !== 'TECHNICIAN') {
    return (
      <div className="nb-card p-6 bg-[#C8B6FF]">
        <p className="font-extrabold uppercase">Production accounts can’t apply</p>
        <p className="text-sm mt-1 font-semibold">Only technician accounts can apply to jobs. Browse talent instead!</p>
        <Link href="/talent" className="nb-btn nb-btn-white mt-4">Find Talent</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="nb-card p-6 bg-[#7AE582]">
        <h3 className="text-xl font-black uppercase">🎉 Application sent!</h3>
        <p className="text-sm font-semibold mt-1">The production house will get back to you. Break a leg!</p>
        <Link href="/jobs" className="nb-btn nb-btn-white mt-4">Browse more jobs</Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverLetter }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
      } else if (res.status === 409) {
        setError('You have already applied to this job.');
      } else if (res.status === 404 && data?.error?.toLowerCase().includes('profile')) {
        setError('Please complete your technician profile first (Dashboard → My Profile).');
      } else {
        setError(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="nb-card p-6">
      <h3 className="text-xl font-black uppercase mb-4">🎟️ Apply for this role</h3>
      <label className="nb-label" htmlFor="cover">Why you? (cover note)</label>
      <textarea
        id="cover"
        rows={5}
        className="nb-input"
        placeholder="Tell them about your experience, tools you know and your availability…"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        required
      />
      {error && (
        <p className="mt-3 border-2 border-black bg-[#FF8FAB] px-3 py-2 text-sm font-bold">{error}</p>
      )}
      <button type="submit" disabled={loading} className="nb-btn nb-btn-red mt-4 w-full">
        {loading ? 'Sending…' : 'Submit Application'}
      </button>
    </form>
  );
}
