import React from 'react';
import { ProductionHistory as ProductionHistoryType } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProductionHistoryTimelineProps {
  history: ProductionHistoryType[];
  onDelete?: (id: string) => void;
  editable?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDateRange(start: Date | string, end?: Date | string | null): string {
  const startStr = new Date(start).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

  if (!end) return `${startStr} – Present`;

  const endStr = new Date(end).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

  return `${startStr} – ${endStr}`;
}

function sortByDate(items: ProductionHistoryType[]): ProductionHistoryType[] {
  return [...items].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

// ─── Individual Entry ─────────────────────────────────────────────────────────
function TimelineEntry({
  entry,
  isLast,
  onDelete,
  editable,
}: {
  entry: ProductionHistoryType;
  isLast: boolean;
  onDelete?: (id: string) => void;
  editable?: boolean;
}) {
  return (
    <div className="relative flex gap-5 group">
      {/* ── Timeline stem ── */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className="relative z-10 flex-shrink-0 w-3 h-3 rounded-full bg-red-600 border-2 border-[#FFFFFF] mt-1.5 group-hover:bg-red-600 group-hover:shadow-[0_0_8px_rgba(230,57,70,0.6)] transition-all duration-300" />
        {/* Connecting line */}
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-red-600/40 to-transparent mt-1" />
        )}
      </div>

      {/* ── Content card ── */}
      <div className="flex-1 pb-8">
        <div className="relative bg-[#FFF4D6] border border-[#111111] rounded-xl p-4 group-hover:border-red-600/20 transition-all duration-300">
          {/* Delete button */}
          {editable && onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors p-1"
              title="Delete entry"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-2 flex-wrap mb-2 pr-6">
            <h3 className="text-black font-bold text-base leading-snug">
              {entry.showTitle}
            </h3>
            {/* Date range */}
            <span className="text-xs text-gray-500 flex-shrink-0 mt-0.5">
              {formatDateRange(entry.startDate, entry.endDate)}
            </span>
          </div>

          {/* Company + Role */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3">
            {entry.company && (
              <>
                <span className="text-sm font-semibold text-red-600">
                  {entry.company}
                </span>
                <span className="text-gray-600 text-xs">·</span>
              </>
            )}
            <span className="text-sm font-medium text-amber-600">
              {entry.roleHeld || entry.role}
            </span>
          </div>

          {/* Venue */}
          {entry.venue && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{entry.venue}</span>
            </div>
          )}

          {/* Description */}
          {entry.description && (
            <p className="text-sm text-gray-400 leading-relaxed mt-2 border-t border-[#111111] pt-2">
              {entry.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductionHistoryTimeline({
  history,
  onDelete,
  editable,
}: ProductionHistoryTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No production history yet.</p>
      </div>
    );
  }

  const sorted = sortByDate(history);

  return (
    <div className="relative">
      {/* Cyan vertical line */}
      <div className="absolute left-[5px] top-0 bottom-8 w-px bg-gradient-to-b from-red-600/60 via-red-600/20 to-transparent pointer-events-none" />

      <div className="space-y-0">
        {sorted.map((entry, idx) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            isLast={idx === sorted.length - 1}
            onDelete={onDelete}
            editable={editable}
          />
        ))}
      </div>
    </div>
  );
}
