'use client';

import { useState, KeyboardEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { DISCIPLINES } from '@/lib/disciplines';

interface FormState {
  title: string;
  description: string;
  roleNeeded: string;
  startDate: string;
  endDate: string;
  budget: string;
  location: string;
}

const inputClass =
  'w-full bg-[#FFF4D6] border border-[#111111] rounded-lg px-4 py-2.5 text-black placeholder-[#444444] focus:outline-none focus:border-[#E63946] transition-colors text-sm';

const labelClass = 'block text-sm font-medium text-[#444444] mb-1.5';

export default function NewJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    roleNeeded: '',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Partial<FormState & { skills: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  // Redirect if not PRODUCTION
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FFF4D6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'authenticated' && (session?.user as any)?.role !== 'PRODUCTION') {
    return (
      <div className="min-h-screen bg-[#FFF4D6] flex items-center justify-center">
        <p className="text-[#D00000] text-lg">Access denied. Production accounts only.</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills((prev) => [...prev, trimmed]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.roleNeeded) newErrors.roleNeeded = 'Please select a role.';
    if (!form.startDate) newErrors.startDate = 'Start date is required.';
    if (!form.location.trim()) newErrors.location = 'Location is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: form.budget ? `₹${form.budget.replace(/^₹/, '')}` : undefined,
          skillsRequired: skills,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create job posting.');
      }

      setSuccessMsg('Job posted successfully! Redirecting…');
      setTimeout(() => router.push('/dashboard/jobs'), 1500);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4D6] text-black">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-[#FFFFFF] transition-colors text-[#444444] hover:text-black"
            aria-label="Go back"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black">Post a New Job</h1>
            <p className="text-sm text-[#444444] mt-0.5">Fill in the details to find your next crew member</p>
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg bg-[#1B9E5A]/10 border border-[#1B9E5A]/30 text-[#1B9E5A] text-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg bg-[#D00000]/10 border border-[#D00000]/30 text-[#D00000] text-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {apiError}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-[#FFFFFF] border border-[#111111] rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Title */}
            <div>
              <label className={labelClass} htmlFor="title">
                Job Title <span className="text-[#D00000]">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Head of Sound for Summer Production"
                className={`${inputClass} ${errors.title ? 'border-[#D00000]' : ''}`}
              />
              {errors.title && <p className="mt-1.5 text-xs text-[#D00000]">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className={labelClass} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the role, expectations, and any special requirements…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Role Needed */}
            <div>
              <label className={labelClass} htmlFor="roleNeeded">
                Role Needed <span className="text-[#D00000]">*</span>
              </label>
              <select
                id="roleNeeded"
                name="roleNeeded"
                value={form.roleNeeded}
                onChange={handleChange}
                className={`${inputClass} ${errors.roleNeeded ? 'border-[#D00000]' : ''}`}
              >
                <option value="" disabled>
                  Select a role…
                </option>
                {DISCIPLINES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {errors.roleNeeded && <p className="mt-1.5 text-xs text-[#D00000]">{errors.roleNeeded}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="startDate">
                  Start Date <span className="text-[#D00000]">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.startDate ? 'border-[#D00000]' : ''}`}
                />
                {errors.startDate && <p className="mt-1.5 text-xs text-[#D00000]">{errors.startDate}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="endDate">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className={labelClass} htmlFor="budget">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-extrabold select-none">₹</span>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 15,000 per show or 60,000 total"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelClass} htmlFor="location">
                Location <span className="text-[#D00000]">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Andheri, Mumbai or Prithvi Theatre, Juhu"
                className={`${inputClass} ${errors.location ? 'border-[#D00000]' : ''}`}
              />
              {errors.location && <p className="mt-1.5 text-xs text-[#D00000]">{errors.location}</p>}
            </div>

            {/* Skills Tag Input */}
            <div>
              <label className={labelClass} htmlFor="skillInput">
                Skills Required
              </label>
              <div
                className={`flex flex-wrap gap-2 bg-[#FFF4D6] border border-[#111111] rounded-lg px-3 py-2 focus-within:border-[#E63946] transition-colors min-h-[46px]`}
              >
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E63946]/15 text-[#E63946] text-xs font-medium border border-[#E63946]/30"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-black transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  id="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : 'Add another…'}
                  className="flex-1 min-w-[140px] bg-transparent text-black text-sm placeholder-[#444444] focus:outline-none py-0.5"
                />
              </div>
              <p className="mt-1.5 text-xs text-[#444444]">Press Enter to add each skill as a tag.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 rounded-lg border border-[#111111] text-[#444444] hover:text-black hover:border-[#444444] transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg bg-[#E63946] text-[#FFF4D6] font-semibold text-sm hover:bg-[#00bce0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFF4D6]/40 border-t-[#FFF4D6] rounded-full animate-spin" />
                    Posting…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Post Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
