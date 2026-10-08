'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CompanyForm {
  companyName: string;
  description: string;
  website: string;
  location: string;
  logoUrl: string;
}

const INITIAL_FORM: CompanyForm = {
  companyName: '',
  description: '',
  website: '',
  location: '',
  logoUrl: '',
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  const isSuccess = type === 'success';
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: isSuccess ? 'rgba(27,158,90,0.15)' : 'rgba(208,0,0,0.15)',
        border: `1px solid ${isSuccess ? '#1B9E5A' : '#D00000'}`,
        color: isSuccess ? '#1B9E5A' : '#D00000',
        zIndex: 9999,
        padding: '12px 20px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      {isSuccess ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {message}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: '#FFF4D6',
  border: '1px solid #111111',
  color: '#111',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s',
};

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: '#444444' }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: '#555555' }}>{hint}</p>}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span style={{ width: '3px', height: '18px', background: '#FFB703', borderRadius: '2px', display: 'inline-block' }} />
      <h2 className="text-black font-semibold text-base">{title}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ background: '#FFFFFF', border: '1px solid #111111' }}
      className="rounded-xl p-6 space-y-5"
    >
      {children}
    </div>
  );
}

// ─── Logo Preview ─────────────────────────────────────────────────────────────
function LogoPreview({ url }: { url: string }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [url]);

  if (!url) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl"
        style={{
          width: '120px',
          height: '120px',
          background: '#FFF4D6',
          border: '2px dashed #111111',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p className="text-xs mt-2" style={{ color: '#666666' }}>No logo</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl"
        style={{
          width: '120px',
          height: '120px',
          background: 'rgba(208,0,0,0.08)',
          border: '2px dashed rgba(208,0,0,0.3)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D00000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p className="text-xs mt-2" style={{ color: '#D00000' }}>Invalid URL</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="Company logo preview"
      onError={() => setError(true)}
      style={{
        width: '120px',
        height: '120px',
        objectFit: 'contain',
        borderRadius: '12px',
        border: '1px solid #111111',
        background: '#FFF4D6',
      }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  const [form, setForm] = useState<CompanyForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/profile/production');
        if (res.ok) {
          const data = await res.json();
          setForm({
            companyName: data.companyName ?? '',
            description: data.description ?? '',
            website: data.website ?? '',
            location: data.location ?? '',
            logoUrl: data.logoUrl ?? '',
          });
        }
      } catch {
        // silently ignore; keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Field update ────────────────────────────────────────────────────────────
  const set = <K extends keyof CompanyForm>(key: K, value: CompanyForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile/production', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Company profile saved!', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message ?? 'Failed to save. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please check your connection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#111111', borderTopColor: '#FFB703' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-black text-2xl font-bold">Company Profile</h1>
        <p style={{ color: '#444444' }} className="text-sm mt-1">
          A strong company profile helps talented crew find you.
        </p>
      </div>

      {/* ── Logo & Identity ── */}
      <Card>
        <SectionTitle title="Identity" />

        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center gap-3">
            <LogoPreview url={form.logoUrl} />
            <p className="text-xs" style={{ color: '#555555' }}>
              Logo Preview
            </p>
          </div>

          <div className="flex-1 space-y-4">
            <FormField label="Company Name">
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                placeholder="National Theatre"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB703')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
            <FormField
              label="Logo URL"
              hint="Paste a direct image URL (PNG, JPG, SVG, or WebP)."
            >
              <input
                type="text"
                value={form.logoUrl}
                onChange={(e) => set('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB703')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* ── Details ── */}
      <Card>
        <SectionTitle title="Company Details" />
        <div className="space-y-4">
          <FormField label="Description" hint="Describe your company, productions, and what kind of crew you work with.">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="We produce Hindi, Marathi and English theatre across Mumbai's best stages, working with…"
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB703')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Juhu, Mumbai"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB703')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
            <FormField label="Website">
              <input
                type="text"
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
                placeholder="https://nationaltheatre.org.uk"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB703')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* ── Save Button ── */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: saving ? 'rgba(255,183,3,0.4)' : '#FFB703',
          color: saving ? 'rgba(10,10,15,0.5)' : '#FFF4D6',
          borderRadius: '10px',
          padding: '14px',
          width: '100%',
          fontSize: '15px',
          fontWeight: '700',
          border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {saving ? 'Saving…' : 'Save Company Profile'}
      </button>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
