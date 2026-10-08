'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { AvailabilityStatus, Discipline, TechnicianFilters } from '../types';
import DisciplineSelect from './DisciplineSelect';
import SkillTag from './SkillTag';

// ─── Props ────────────────────────────────────────────────────────────────────
interface SearchFiltersProps {
  onFilterChange: (filters: TechnicianFilters) => void;
  initialFilters?: Partial<TechnicianFilters>;
}

// ─── Default filters ──────────────────────────────────────────────────────────
const defaultFilters: TechnicianFilters = {
  discipline: '',
  location: '',
  availability: [],
  skills: [],
};

// ─── Availability options ─────────────────────────────────────────────────────
const availabilityOptions: {
  value: AvailabilityStatus;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    value: 'AVAILABLE',
    label: 'Available',
    color: 'border-[#1B9E5A]/30 text-[#1B9E5A] bg-[#1B9E5A]/10',
    dot: 'bg-[#1B9E5A]',
  },
  {
    value: 'BOOKED',
    label: 'Booked',
    color: 'border-[#D00000]/30 text-[#D00000] bg-[#D00000]/10',
    dot: 'bg-[#D00000]',
  },
  {
    value: 'OPEN_TO_OFFERS',
    label: 'Open to Offers',
    color: 'border-[#FFB703]/30 text-[#FFB703] bg-[#FFB703]/10',
    dot: 'bg-[#FFB703]',
  },
];

// ─── Section header ───────────────────────────────────────────────────────────
function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SearchFilters({
  onFilterChange,
  initialFilters = {},
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<TechnicianFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const skillInputRef = useRef<HTMLInputElement>(null);

  // ── Update a single filter field ──────────────────────────────────────────
  function updateFilter<K extends keyof TechnicianFilters>(
    key: K,
    value: TechnicianFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // ── Toggle availability ───────────────────────────────────────────────────
  function toggleAvailability(status: AvailabilityStatus) {
    setFilters((prev) => {
      const exists = prev.availability.includes(status);
      return {
        ...prev,
        availability: exists
          ? prev.availability.filter((s) => s !== status)
          : [...prev.availability, status],
      };
    });
  }

  // ── Add skill ─────────────────────────────────────────────────────────────
  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || filters.skills.includes(trimmed)) return;
    updateFilter('skills', [...filters.skills, trimmed]);
    setSkillInput('');
    skillInputRef.current?.focus();
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  }

  function removeSkill(skill: string) {
    updateFilter('skills', filters.skills.filter((s) => s !== skill));
  }

  // ── Apply + Reset ──────────────────────────────────────────────────────────
  function applyFilters() {
    onFilterChange(filters);
    setMobileOpen(false);
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSkillInput('');
    onFilterChange(defaultFilters);
  }

  // ── Filter body (shared between desktop & mobile) ─────────────────────────
  const filterBody = (
    <div className="space-y-5">
      {/* Discipline */}
      <FilterSection label="Discipline">
        <DisciplineSelect
          value={filters.discipline}
          onChange={(v) => updateFilter('discipline', v)}
          includeAllOption
        />
      </FilterSection>

      {/* Location */}
      <FilterSection label="Location">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            placeholder="City or country…"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[#FFF4D6] text-black border border-[#111111] focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 hover:border-[#000000] transition-all duration-200 placeholder:text-gray-600"
          />
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection label="Availability">
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((opt) => {
            const isSelected = filters.availability.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleAvailability(opt.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isSelected
                    ? opt.color
                    : 'border-[#111111] text-gray-400 bg-transparent hover:border-[#000000]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? opt.dot : 'bg-gray-600'}`} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Skills */}
      <FilterSection label="Skills">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              ref={skillInputRef}
              type="text"
              placeholder="e.g. QLab, L-ISA…"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-[#FFF4D6] text-black border border-[#111111] focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 hover:border-[#000000] transition-all duration-200 placeholder:text-gray-600"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!skillInput.trim()}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-red-600/10 text-red-600 border border-red-600/20 hover:bg-red-600/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              Add
            </button>
          </div>

          {/* Added skill tags */}
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {filters.skills.map((skill) => (
                <SkillTag
                  key={skill}
                  name={skill}
                  onRemove={() => removeSkill(skill)}
                  small
                />
              ))}
            </div>
          )}
        </div>
      </FilterSection>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#111111]">
        <button
          type="button"
          onClick={applyFilters}
          className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-[#FFF4D6] bg-red-600 hover:bg-red-600 active:bg-red-600 transition-all duration-200 shadow-[0_0_12px_rgba(230,57,70,0.25)]"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors duration-200 whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: sidebar panel ── */}
      <div className="hidden lg:block">
        <div className="bg-[#FFFFFF] border border-[#111111] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-black font-semibold text-base flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>
          </div>
          {filterBody}
        </div>
      </div>

      {/* ── Mobile: collapsible panel ── */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border border-[#111111] rounded-xl text-sm font-medium text-black hover:border-red-600/30 transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {/* Active filter count badge */}
            {(filters.discipline || filters.location || filters.availability.length > 0 || filters.skills.length > 0) && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-red-600 text-[#FFF4D6]">
                {[
                  filters.discipline ? 1 : 0,
                  filters.location ? 1 : 0,
                  filters.availability.length,
                  filters.skills.length,
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Collapsible content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
        >
          <div className="bg-[#FFFFFF] border border-[#111111] rounded-xl p-5">
            {filterBody}
          </div>
        </div>
      </div>
    </>
  );
}
