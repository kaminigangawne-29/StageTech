'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Job, JobStatus } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: JobStatus }) {
  const config: Record<JobStatus, { label: string; color: string; bg: string }> = {
    OPEN: { label: 'Open', color: '#1B9E5A', bg: '#1B9E5A15' },
    FILLED: { label: 'Filled', color: '#FFB703', bg: '#FFB70315' },
    CLOSED: { label: 'Closed', color: '#D00000', bg: '#D0000015' },
  };
  const { label, color, bg } = config[status] ?? config.OPEN;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color, backgroundColor: bg, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── Production: Job Management Card ─────────────────────────────────────────

interface JobManagementCardProps {
  job: Job;
  onClose: (id: string) => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
}

function JobManagementCard({ job, onClose, onDelete, actionLoading }: JobManagementCardProps) {
  const busy = actionLoading === job.id;
  return (
    <div className="bg-[#FFFFFF] border border-[#111111] rounded-xl p-5 hover:border-[#2e2e3e] transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-black font-semibold text-base truncate">{job.title}</h3>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex items-center gap-4 text-xs text-[#444444] flex-wrap">
            <span className="flex items-center gap-1">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                <span className="font-semibold text-black">{job.applicantCount ?? 0}</span> applicant
                {(job.applicantCount ?? 0) !== 1 ? 's' : ''}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Posted {formatDate(job.createdAt)}
            </span>
            {job.location && (
              <span className="flex items-center gap-1">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            )}
          </div>
          {job.roleNeeded && (
            <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20">
              {job.roleNeeded}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="px-3 py-1.5 rounded-lg border border-[#FFB703]/60 text-[#FFB703] text-xs font-semibold hover:bg-[#FFB703]/10 transition-colors"
          >
            Edit
          </Link>
          {job.status === 'OPEN' ? (
            <button
              onClick={() => onClose(job.id)}
              disabled={busy}
              className="px-3 py-1.5 rounded-lg border border-[#D00000]/60 text-[#D00000] text-xs font-semibold hover:bg-[#D00000]/10 transition-colors disabled:opacity-50"
            >
              {busy ? 'Closing…' : 'Close'}
            </button>
          ) : (
            <button
              onClick={() => onDelete(job.id)}
              disabled={busy}
              className="px-3 py-1.5 rounded-lg border border-[#D00000]/60 text-[#D00000] text-xs font-semibold hover:bg-[#D00000]/10 transition-colors disabled:opacity-50"
            >
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Technician: Job Card ─────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  applied: boolean;
  applying: boolean;
  onApply: (id: string) => void;
}

function JobCard({ job, applied, applying, onApply }: JobCardProps) {
  return (
    <div className="bg-[#FFFFFF] border border-[#111111] rounded-xl p-5 hover:border-[#2e2e3e] transition-colors flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-black font-semibold text-sm leading-snug truncate">{job.title}</h3>
          <p className="text-[#444444] text-xs mt-0.5 truncate">{job.companyName}</p>
        </div>
        <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20">
          {job.roleNeeded}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#444444]">
        {(job.startDate || job.endDate) && (
          <span className="flex items-center gap-1 col-span-2">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(job.startDate)}
            {job.endDate ? ` – ${formatDate(job.endDate)}` : ' onwards'}
          </span>
        )}
        {job.budget && (
          <span className="flex items-center gap-1 font-semibold text-[#FFB703]">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.budget}
          </span>
        )}
        {job.location && (
          <span className="flex items-center gap-1">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
        )}
      </div>

      {job.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skillsRequired.slice(0, 4).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#111111] text-[#444444]">
              {s}
            </span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#111111] text-[#444444]">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      )}

      <button
        onClick={() => onApply(job.id)}
        disabled={applied || applying}
        className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2
          ${
            applied
              ? 'bg-[#1B9E5A]/15 text-[#1B9E5A] border border-[#1B9E5A]/30 cursor-default'
              : 'bg-[#E63946] text-[#FFF4D6] hover:bg-[#00bce0] disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
      >
        {applied ? (
          <>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Applied
          </>
        ) : applying ? (
          <>
            <div className="w-4 h-4 border-2 border-[#FFF4D6]/30 border-t-[#FFF4D6] rounded-full animate-spin" />
            Applying…
          </>
        ) : (
          'Apply Now'
        )}
      </button>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-[#111111] text-[#444444] hover:text-black hover:border-[#2e2e3e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
            ${
              p === page
                ? 'bg-[#E63946] text-[#FFF4D6]'
                : 'border border-[#111111] text-[#444444] hover:text-black hover:border-[#2e2e3e]'
            }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-[#111111] text-[#444444] hover:text-black hover:border-[#2e2e3e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export default function JobsPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as 'PRODUCTION' | 'TECHNICIAN' | undefined;

  // Shared state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Production state
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Technician state
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    setError('');
    try {
      let url = '';
      if (role === 'PRODUCTION') {
        url = '/api/jobs?mine=true';
      } else {
        const params = new URLSearchParams();
        if (roleFilter) params.set('role', roleFilter);
        if (locationFilter) params.set('location', locationFilter);
        params.set('page', String(page));
        params.set('pageSize', String(PAGE_SIZE));
        url = `/api/jobs?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load jobs.');
      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);
        setTotal(data.length);
      } else {
        const list = data.jobs ?? data.data ?? [];
        setJobs(list);
        setTotal(data.total ?? list.length);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [role, roleFilter, locationFilter, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, locationFilter]);

  // ── Production actions ─────────────────────────────────────────────────────

  const handleClose = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CLOSED' }),
      });
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'CLOSED' } : j)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    setActionLoading(id);
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  // ── Technician actions ─────────────────────────────────────────────────────

  const handleApply = async (id: string) => {
    setApplyingId(id);
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, { method: 'POST' });
      if (res.ok) {
        setAppliedIds((prev) => new Set(prev).add(id));
      }
    } finally {
      setApplyingId(null);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (status === 'loading' || (loading && jobs.length === 0)) {
    return (
      <div className="min-h-screen bg-[#FFF4D6] text-black px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-[#FFFFFF] rounded-lg animate-pulse mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#FFFFFF] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF4D6] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-[#D00000] text-lg">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 rounded-lg bg-[#E63946] text-[#FFF4D6] text-sm font-semibold hover:bg-[#00bce0] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCTION VIEW
  // ──────────────────────────────────────────────────────────────────────────

  if (role === 'PRODUCTION') {
    return (
      <div className="min-h-screen bg-[#FFF4D6] text-black px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-black">My Job Postings</h1>
              <p className="text-sm text-[#444444] mt-0.5">
                {jobs.length} posting{jobs.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link
              href="/dashboard/jobs/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E63946] text-[#FFF4D6] font-semibold text-sm hover:bg-[#00bce0] transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </div>

          {/* Empty State */}
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center mb-4">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#444444" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-black font-semibold text-lg mb-2">No job postings yet</h3>
              <p className="text-[#444444] text-sm mb-6 max-w-xs">
                Start posting jobs to find the perfect crew for your production.
              </p>
              <Link
                href="/dashboard/jobs/new"
                className="px-5 py-2.5 rounded-lg bg-[#E63946] text-[#FFF4D6] font-semibold text-sm hover:bg-[#00bce0] transition-colors"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobManagementCard
                  key={job.id}
                  job={job}
                  onClose={handleClose}
                  onDelete={handleDelete}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TECHNICIAN VIEW
  // ──────────────────────────────────────────────────────────────────────────

  const pagedJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#FFF4D6] text-black px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-1">Browse Open Jobs</h1>
          <p className="text-sm text-[#444444]">
            {total} open position{total !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 8h12M9 12h6" />
            </svg>
            <input
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder="Filter by role…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#FFFFFF] border border-[#111111] rounded-lg text-black text-sm placeholder-[#444444] focus:outline-none focus:border-[#E63946] transition-colors"
            />
          </div>
          <div className="relative flex-1 min-w-[180px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#FFFFFF] border border-[#111111] rounded-lg text-black text-sm placeholder-[#444444] focus:outline-none focus:border-[#E63946] transition-colors"
            />
          </div>
          {(roleFilter || locationFilter) && (
            <button
              onClick={() => { setRoleFilter(''); setLocationFilter(''); }}
              className="px-4 py-2.5 rounded-lg border border-[#111111] text-[#444444] text-sm hover:text-black hover:border-[#2e2e3e] transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center mb-4">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#444444" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-black font-semibold text-lg mb-2">No jobs found</h3>
            <p className="text-[#444444] text-sm max-w-xs">
              {roleFilter || locationFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Check back soon for new opportunities.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pagedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  applied={appliedIds.has(job.id)}
                  applying={applyingId === job.id}
                  onApply={handleApply}
                />
              ))}
            </div>
            <Pagination
              page={page}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
