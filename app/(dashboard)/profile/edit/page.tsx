'use client';

import { useState, useEffect, useCallback } from 'react';
import { DISCIPLINES } from '@/lib/disciplines';

// ─── Types ────────────────────────────────────────────────────────────────────
type AvailabilityStatus = 'AVAILABLE' | 'OPEN_TO_OFFERS' | 'BOOKED';

interface ProfileForm {
  fullName: string;
  bio: string;
  locationCity: string;
  primaryDiscipline: string;
  availabilityStatus: AvailabilityStatus;
  websiteUrl: string;
  phone: string;
  skills: string[];
}

const INITIAL_FORM: ProfileForm = {
  fullName: '',
  bio: '',
  locationCity: 'Mumbai',
  primaryDiscipline: '',
  availabilityStatus: 'AVAILABLE',
  websiteUrl: '',
  phone: '',
  skills: [],
};

// ─── Availability Options ─────────────────────────────────────────────────────
const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; color: string; bg: string }[] = [
  { value: 'AVAILABLE',      label: 'Available',       color: '#1B9E5A', bg: 'rgba(27,158,90,0.15)' },
  { value: 'OPEN_TO_OFFERS', label: 'Open to Offers',  color: '#FFB703', bg: 'rgba(255,183,3,0.15)'  },
  { value: 'BOOKED',         label: 'Booked',          color: '#D00000', bg: 'rgba(208,0,0,0.15)'  },
];

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
      }}
      className="rounded-xl px-5 py-3 flex items-center gap-3 text-sm font-medium shadow-xl animate-fade-in"
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

// ─── Form Components ──────────────────────────────────────────────────────────
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

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
      onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
      onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
    />
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ width: '3px', height: '18px', background: '#E63946', borderRadius: '2px', display: 'inline-block' }} />
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfileEditPage() {
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/profile/technician');
        if (res.ok) {
          const data = await res.json();
          setForm({
            fullName: data.fullName ?? '',
            bio: data.bio ?? '',
            locationCity: data.locationCity ?? '',
            primaryDiscipline: data.primaryDiscipline ?? '',
            availabilityStatus: data.availabilityStatus ?? 'AVAILABLE',
            websiteUrl: data.websiteUrl ?? '',
            phone: data.phone ?? '',
            skills: (data.skills ?? [])
              .map((s: any) => (typeof s === 'string' ? s : s?.skill?.name ?? s?.name))
              .filter(Boolean),
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
  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Skill management ────────────────────────────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      set('skills', [...form.skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    set('skills', form.skills.filter((s) => s !== skill));

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile/technician', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Profile saved successfully!', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message ?? 'Failed to save profile. Please try again.', 'error');
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
          style={{ borderColor: '#111111', borderTopColor: '#E63946' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-black text-2xl font-bold">Edit Profile</h1>
        <p style={{ color: '#444444' }} className="text-sm mt-1">
          Keep your profile up to date to attract the best opportunities.
        </p>
      </div>

      {/* ── Basic Info ── */}
      <Card>
        <SectionTitle title="Basic Information" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name">
            <TextInput
              value={form.fullName}
              onChange={(v) => set('fullName', v)}
              placeholder="Jane Smith"
            />
          </FormField>
          <FormField label="Location / City">
            <TextInput
              value={form.locationCity}
              onChange={(v) => set('locationCity', v)}
              placeholder="Mumbai, Maharashtra"
            />
          </FormField>
        </div>
        <FormField label="Bio" hint="Tell productions a little about yourself and your experience.">
          <Textarea
            value={form.bio}
            onChange={(v) => set('bio', v)}
            placeholder="Lighting designer with 8 years across Prithvi, NCPA and Jamnabai Narsee stages…"
            rows={4}
          />
        </FormField>
        <FormField label="Primary Discipline">
          <select
            value={form.primaryDiscipline}
            onChange={(e) => set('primaryDiscipline', e.target.value)}
            style={{ ...inputStyle }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
          >
            <option value="">Select a discipline…</option>
            {DISCIPLINES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </FormField>
      </Card>

      {/* ── Availability ── */}
      <Card>
        <SectionTitle title="Availability" />
        <div className="flex gap-3">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const isSelected = form.availabilityStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => set('availabilityStatus', opt.value)}
                style={{
                  border: `2px solid ${isSelected ? opt.color : '#111111'}`,
                  background: isSelected ? opt.bg : '#FFF4D6',
                  color: isSelected ? opt.color : '#444444',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  flex: 1,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── Skills ── */}
      <Card>
        <SectionTitle title="Skills" />
        <FormField label="Add Skill" hint="Press Enter to add each skill.">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. Yamaha CL5, QLab, ETC Ion…"
              style={{ ...inputStyle, flex: 1 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
            />
            <button
              onClick={addSkill}
              style={{
                background: 'rgba(230,57,70,0.15)',
                border: '1px solid rgba(230,57,70,0.3)',
                color: '#E63946',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              + Add
            </button>
          </div>
        </FormField>

        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(230,57,70,0.12)',
                  border: '1px solid rgba(230,57,70,0.25)',
                  color: '#E63946',
                }}
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  style={{ color: '#E63946', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0 0 0 2px' }}
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {form.skills.length === 0 && (
          <p style={{ color: '#555555' }} className="text-sm">
            No skills added yet. Type a skill above and press Enter.
          </p>
        )}
      </Card>

      {/* ── Links & Contact ── */}
      <Card>
        <SectionTitle title="Links & Contact" />
        <div className="space-y-4">
          <FormField label="Portfolio / Website URL">
            <TextInput
              value={form.websiteUrl}
              onChange={(v) => set('websiteUrl', v)}
              placeholder="https://yourportfolio.com"
            />
          </FormField>
          <FormField label="Phone Number">
            <TextInput
              value={form.phone}
              onChange={(v) => set('phone', v)}
              placeholder="+91 98200 00000"
            />
          </FormField>
        </div>
      </Card>

      {/* ── Save Button ── */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: saving ? 'rgba(230,57,70,0.4)' : '#E63946',
          color: saving ? 'rgba(255,255,255,0.6)' : '#FFF4D6',
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
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
