import React from 'react';
import Link from 'next/link';
import { Discipline, JobStatus } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────
interface JobCardProps {
  id: string;
  title: string;
  roleNeeded: Discipline;
  location: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  budget?: number | null;
  budgetCurrency?: string;
  status: JobStatus;
  companyName: string;
  companyLogoUrl?: string | null;
}

// ─── Discipline label map ─────────────────────────────────────────────────────
const disciplineLabels: Record<string, string> = {
  LIGHTING_DESIGNER:  'Lighting Designer',
  LIGHTING_OPERATOR:  'Lighting Operator',
  SOUND_DESIGNER:     'Sound Designer',
  SOUND_OPERATOR:     'Sound Operator',
  ART_DIRECTOR:       'Art Director',
  COSTUME_DESIGNER:   'Costume Designer',
  SET_DESIGNER:       'Set Designer',
  STAGE_MANAGER:      'Stage Manager',
  PRODUCTION_MANAGER: 'Production Manager',
  PUBLIC_RELATIONS:   'Public Relations',
  OTHER:              'Other',
};

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<JobStatus, { label: string; classes: string }> = {
  OPEN: {
    label: 'Open',
    classes: 'bg-[#1B9E5A]/15 text-[#1B9E5A] border-[#1B9E5A]/30',
  },
  FILLED: {
    label: 'Filled',
    classes: 'bg-white/5 text-gray-400 border-white/10',
  },
  CLOSED: {
    label: 'Closed',
    classes: 'bg-[#D00000]/15 text-[#D00000] border-[#D00000]/30',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatBudget(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency || 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Company Logo / Initials ──────────────────────────────────────────────────
function CompanyLogo({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-[#FFF4D6] flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-sm font-bold text-black flex-shrink-0 border border-white/10">
      {initials}
    </div>
  );
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JobCard({
  id,
  title,
  roleNeeded,
  location,
  startDate,
  endDate,
  budget,
  budgetCurrency = 'GBP',
  status,
  companyName,
  companyLogoUrl,
}: JobCardProps) {
  const { label: statusLabel, classes: statusClasses } = statusConfig[status] || statusConfig.OPEN;
  const isOpen = status === 'OPEN';

  return (
    <div className="group relative flex bg-[#FFFFFF] border border-[#111111] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-600/30 hover:shadow-[0_0_30px_rgba(255,183,3,0.06)] hover:-translate-y-0.5">
      {/* ── Amber left accent bar ── */}
      <div className="w-1 flex-shrink-0 bg-gradient-to-b from-amber-600 via-amber-600 to-orange-600" />

      <div className="flex flex-col p-5 gap-4 flex-1 min-w-0">
        {/* ── Header: logo + title + status ── */}
        <div className="flex items-start gap-3">
          <CompanyLogo name={companyName} logoUrl={companyLogoUrl} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5 truncate">{companyName}</p>
                <h3 className="text-black font-bold text-base leading-snug">{title}</h3>
              </div>
              {/* Status badge */}
              <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClasses}`}>
                {statusLabel}
              </span>
            </div>

            {/* Role badge */}
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-600/10 text-amber-600 border border-amber-600/20">
              {disciplineLabels[roleNeeded]}
            </span>
          </div>
        </div>

        {/* ── Meta info row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Date range */}
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <CalendarIcon />
            <span>
              {formatDate(startDate)}
              {endDate ? ` – ${formatDate(endDate)}` : ' onwards'}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <PinIcon />
            <span className="truncate">{location}</span>
          </div>

          {/* Budget */}
          {budget != null && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <CurrencyIcon />
              <span>{formatBudget(budget, budgetCurrency)}</span>
            </div>
          )}
        </div>

        {/* ── CTA buttons ── */}
        <div className="flex items-center gap-3 mt-auto pt-1">
          <Link
            href={`/jobs/${id}`}
            className="flex-1 text-center py-2 px-4 rounded-xl text-sm font-medium text-gray-300 border border-[#111111] hover:border-white/20 hover:text-black transition-all duration-200"
          >
            View Details
          </Link>

          {isOpen && (
            <Link
              href={`/jobs/${id}/apply`}
              className="flex-1 text-center py-2 px-4 rounded-xl text-sm font-semibold text-[#FFF4D6] bg-amber-600 hover:bg-amber-600 active:bg-amber-600 transition-all duration-200 shadow-[0_0_12px_rgba(255,183,3,0.25)] hover:shadow-[0_0_20px_rgba(255,183,3,0.4)]"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
