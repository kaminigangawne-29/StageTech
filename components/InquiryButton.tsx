'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function InquiryButton({
  receiverUserId,
  techName,
}: {
  receiverUserId: string;
  techName: string;
}) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const role = (session?.user as { role?: string } | undefined)?.role;
  const myId = (session?.user as { id?: string } | undefined)?.id;

  if (status === 'loading') return <div className="w-40 h-12 bg-white border-4 border-black animate-pulse" />;

  if (!session) {
    return (
      <Link href={`/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/talent')}`} className="nb-btn nb-btn-red">
        ✉️ Sign in to Send Inquiry
      </Link>
    );
  }

  if (myId === receiverUserId) return null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: receiverUserId, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setSent(true);
      else setError(data?.error || 'Could not send. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => { setOpen(true); setSent(false); }} className="nb-btn nb-btn-red">
        ✉️ Send Inquiry
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div className="nb-card w-full max-w-lg p-6 bg-[#FFF4D6]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-black uppercase leading-tight">Inquiry to {techName}</h3>
              <button onClick={() => setOpen(false)} className="nb-btn nb-btn-white !p-1 !px-3" aria-label="Close">✕</button>
            </div>

            {sent ? (
              <div>
                <p className="border-2 border-black bg-[#7AE582] px-3 py-3 font-bold">
                  🎉 Inquiry sent! {techName} will see it in their inbox.
                </p>
                <div className="flex gap-3 mt-4 flex-wrap">
                  <Link href="/messages" className="nb-btn nb-btn-blue">Open Messages</Link>
                  <button onClick={() => { setOpen(false); setContent(''); }} className="nb-btn nb-btn-white">Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={send}>
                {role === 'TECHNICIAN' && (
                  <p className="mb-3 text-xs font-bold border-2 border-black bg-[#FFD60A] px-2 py-1">
                    You’re signed in as a technician — you can still message other artists.
                  </p>
                )}
                <label className="nb-label" htmlFor="inq">Your message</label>
                <textarea
                  id="inq"
                  rows={5}
                  required
                  className="nb-input"
                  placeholder="Hi! We’re staging a show in Mumbai next month and would love to have you on board…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {error && <p className="mt-3 border-2 border-black bg-[#FF8FAB] px-3 py-2 text-sm font-bold">{error}</p>}
                <button type="submit" disabled={loading || !content.trim()} className="nb-btn nb-btn-red mt-4 w-full">
                  {loading ? 'Sending…' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
