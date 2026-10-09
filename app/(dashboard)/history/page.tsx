'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HistoryEntry {
  id: string;
  showTitle: string;
  company: string;
  roleHeld: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface NewEntryForm {
  showTitle: string;
  company: string;
  roleHeld: string;
  startDate: string;
  endDate: string;
  description: string;
}

const INITIAL_FORM: NewEntryForm = {
  showTitle: '',
  company: '',
  roleHeld: '',
  startDate: '',
  endDate: '',
  description: '',
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
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: '#444444', fontSize: '13px', fontWeight: '500' }}>{label}</label>
      {children}
    </div>
  );
}

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  };
  const s = fmt(start);
  const e = end ? fmt(end) : 'Present';
  return s ? `${s} – ${e}` : '';
}

// ─── Timeline Card ────────────────────────────────────────────────────────────
function TimelineCard({
  entry,
  onDelete,
}: {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
}) {
  const dateRange = formatDateRange(entry.startDate, entry.endDate);

  return (
    <div className="flex gap-0">
      {/* Left accent line + dot */}
      <div className="flex flex-col items-center mr-4" style={{ width: '24px', flexShrink: 0 }}>
        <div
          style={{
            width: '3px',
            height: '20px',
            background: '#E63946',
            borderRadius: '2px 2px 0 0',
          }}
        />
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#E63946',
            border: '3px solid #FFF4D6',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            width: '2px',
            background: 'linear-gradient(to bottom, #E6394644, transparent)',
            minHeight: '40px',
          }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #111111',
          borderLeft: '3px solid #E63946',
          borderRadius: '12px',
          padding: '18px 20px',
          flex: 1,
          marginBottom: '16px',
          position: 'relative',
        }}
      >
        {/* Delete button */}
        <button
          onClick={() => onDelete(entry.id)}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(208,0,0,0.12)',
            border: '1px solid rgba(208,0,0,0.3)',
            color: '#D00000',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
          aria-label="Delete entry"
        >
          ×
        </button>

        {/* Show Title */}
        <p className="text-black font-bold text-base pr-10">{entry.showTitle}</p>

        {/* Company */}
        {entry.company && (
          <p style={{ color: '#444444' }} className="text-sm mt-0.5">
            {entry.company}
          </p>
        )}

        {/* Role Badge + Date */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {entry.roleHeld && (
            <span
              style={{
                background: 'rgba(230,57,70,0.12)',
                border: '1px solid rgba(230,57,70,0.25)',
                color: '#E63946',
                borderRadius: '6px',
                padding: '2px 10px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {entry.roleHeld}
            </span>
          )}
          {dateRange && (
            <span style={{ color: '#555555', fontSize: '12px' }}>
              📅 {dateRange}
            </span>
          )}
        </div>

        {/* Description */}
        {entry.description && (
          <p style={{ color: '#444444', fontSize: '13px', lineHeight: '1.6' }} className="mt-3">
            {entry.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 rounded-xl"
      style={{ border: '2px dashed #111111' }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <p className="text-black font-medium mt-4">No production history yet</p>
      <p style={{ color: '#555555' }} className="text-sm mt-1">
        Add your first show to build your timeline.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewEntryForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch entries ───────────────────────────────────────────────────────────
  const fetchEntries = useCallback(async () => {
    try {
      let localEntries: HistoryEntry[] = [];
      try {
        const stored = localStorage.getItem('stagetech_history');
        if (stored) localEntries = JSON.parse(stored);
      } catch {}

      const res = await fetch('/api/history').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const apiEntries = Array.isArray(data) ? data : data.entries ?? [];
        const combined = [...localEntries, ...apiEntries.filter((a: any) => !localEntries.some((l) => l.id === a.id))];
        setEntries(combined);
      } else {
        if (localEntries.length === 0) {
          // Default initial sample history entries
          const sampleHistory: HistoryEntry[] = [
            {
              id: 'sample-hist-1',
              showTitle: 'Mughal-e-Azam Musical',
              company: 'NCPA Mumbai',
              roleHeld: 'Lighting Designer',
              startDate: '2023-01-01',
              endDate: '2023-06-01',
              description: 'Managed grand stage lighting design and cue calling for 50+ shows in Mumbai.',
            },
            {
              id: 'sample-hist-2',
              showTitle: 'Taj Mahal ka Tender',
              company: 'Prithvi Players',
              roleHeld: 'Lighting Board Operator',
              startDate: '2023-07-01',
              endDate: '2023-12-01',
              description: 'Ran GrandMA3 console live cues across 24 performances.',
            },
          ];
          localStorage.setItem('stagetech_history', JSON.stringify(sampleHistory));
          setEntries(sampleHistory);
        } else {
          setEntries(localEntries);
        }
      }
    } catch {
      let localEntries: HistoryEntry[] = [];
      try {
        const stored = localStorage.getItem('stagetech_history');
        if (stored) localEntries = JSON.parse(stored);
      } catch {}
      setEntries(localEntries);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // ── Field update ────────────────────────────────────────────────────────────
  const set = <K extends keyof NewEntryForm>(key: K, value: NewEntryForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Submit new entry ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.showTitle.trim()) {
      showToast('Show title is required.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const newEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        showTitle: form.showTitle.trim(),
        company: form.company.trim(),
        roleHeld: form.roleHeld.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
      };

      let existing: HistoryEntry[] = [];
      try {
        const stored = localStorage.getItem('stagetech_history');
        if (stored) existing = JSON.parse(stored);
      } catch {}

      const updated = [newEntry, ...existing];
      localStorage.setItem('stagetech_history', JSON.stringify(updated));
      setEntries(updated);

      const isGithubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
      if (!isGithubPages) {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }).catch(() => null);
      }

      showToast('Show added to history! 🎭', 'success');
      setForm(INITIAL_FORM);
      setShowForm(false);
    } catch {
      showToast('Show saved to history! 🎭', 'success');
      setForm(INITIAL_FORM);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete entry ────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      let existing: HistoryEntry[] = [];
      try {
        const stored = localStorage.getItem('stagetech_history');
        if (stored) existing = JSON.parse(stored);
      } catch {}

      const updated = existing.filter((e) => e.id !== id);
      localStorage.setItem('stagetech_history', JSON.stringify(updated));
      setEntries((prev) => prev.filter((e) => e.id !== id));

      const isGithubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
      if (!isGithubPages) {
        await fetch(`/api/history/${id}`, { method: 'DELETE' }).catch(() => null);
      }
      showToast('Entry removed.', 'success');
    } catch {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast('Entry removed.', 'success');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black text-2xl font-bold">Production History</h1>
          <p style={{ color: '#444444' }} className="text-sm mt-1">
            Your professional theatre timeline.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            background: showForm ? 'rgba(230,57,70,0.1)' : '#E63946',
            color: showForm ? '#E63946' : '#FFF4D6',
            border: '1px solid #E63946',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Show to History'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{ background: '#FFFFFF', border: '1px solid #E6394644', borderRadius: '14px', padding: '24px' }}
          className="space-y-4"
        >
          <h2 className="text-black font-semibold flex items-center gap-2 mb-2">
            <span style={{ width: '3px', height: '16px', background: '#E63946', borderRadius: '2px', display: 'inline-block' }} />
            Add New Show
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Show Title *">
              <input
                type="text"
                value={form.showTitle}
                onChange={(e) => set('showTitle', e.target.value)}
                placeholder="Hamlet"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
            <FormField label="Company / Venue">
              <input
                type="text"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="Royal Shakespeare Company"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Your Role">
              <input
                type="text"
                value={form.roleHeld}
                onChange={(e) => set('roleHeld', e.target.value)}
                placeholder="Sound Designer"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
            <FormField label="Start Date">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                style={{
                  ...inputStyle,
                  colorScheme: 'dark',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
            <FormField label="End Date">
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                style={{
                  ...inputStyle,
                  colorScheme: 'dark',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe your responsibilities, key achievements, or notable aspects of this production…"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
            />
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? 'rgba(230,57,70,0.4)' : '#E63946',
              color: submitting ? 'rgba(10,10,15,0.5)' : '#FFF4D6',
              borderRadius: '10px',
              padding: '12px',
              width: '100%',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {submitting ? 'Adding…' : 'Add to History'}
          </button>
        </form>
      )}

      {/* ── Timeline ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#111111', borderTopColor: '#E63946' }}
          />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col">
          {entries.map((entry) => (
            <TimelineCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
