import React from 'react';
import Link from 'next/link';
import { AvailabilityStatus, Discipline, TechnicianSkill } from '../types';
import AvailabilityBadge from './AvailabilityBadge';

// ─── Props ────────────────────────────────────────────────────────────────────
interface TechnicianCardProps {
  id: string;
  fullName: string;
  primaryDiscipline: Discipline;
  locationCity: string | null;
  availabilityStatus: AvailabilityStatus;
  profileImageUrl: string | null;
  skills: TechnicianSkill[];
}

// ─── Discipline → colour map ──────────────────────────────────────────────────
const disciplineColors: Record<string, string> = {
  LIGHTING_DESIGNER:  'from-yellow-500 to-amber-600',
  LIGHTING_OPERATOR:  'from-yellow-400 to-yellow-600',
  SOUND_DESIGNER:     'from-purple-500 to-violet-600',
  SOUND_OPERATOR:     'from-purple-400 to-purple-600',
  ART_DIRECTOR:       'from-pink-500 to-rose-600',
  COSTUME_DESIGNER:   'from-fuchsia-500 to-pink-600',
  SET_DESIGNER:       'from-orange-500 to-red-600',
  STAGE_MANAGER:      'from-green-500 to-emerald-600',
  PRODUCTION_MANAGER: 'from-red-600 to-teal-600',
  OTHER:              'from-gray-500 to-gray-600',
};

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

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({
  name,
  imageUrl,
  discipline,
}: {
  name: string;
  imageUrl: string | null;
  discipline: Discipline;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10"
      />
    );
  }

  const gradient = disciplineColors[discipline] ?? 'from-red-600 to-red-600';

  return (
    <div
      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl font-bold text-black/90 border-2 border-white/10 shadow-inner`}
    >
      {initials}
    </div>
  );
}

// ─── Pin Icon ─────────────────────────────────────────────────────────────────
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

// ─── Skill Tag (inline mini version) ──────────────────────────────────────────
function MiniSkillTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-600/10 text-red-600 border border-red-600/20">
      {name}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TechnicianCard({
  id,
  fullName,
  primaryDiscipline,
  locationCity,
  availabilityStatus,
  profileImageUrl,
  skills,
}: TechnicianCardProps) {
  const visibleSkills = skills.slice(0, 3);
  const extraCount = skills.length - 3;

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] border border-[#111111] rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-600/30 hover:shadow-[0_0_30px_rgba(230,57,70,0.08)] hover:-translate-y-0.5">
      {/* ── Top accent bar ── */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${disciplineColors[primaryDiscipline] ?? 'from-red-600 to-red-600'}`}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* ── Header row: avatar + info ── */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar name={fullName} imageUrl={profileImageUrl} discipline={primaryDiscipline} />
            {/* Availability dot overlay */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#FFFFFF] ${
                availabilityStatus === 'AVAILABLE'
                  ? 'bg-[#1B9E5A]'
                  : availabilityStatus === 'BOOKED'
                  ? 'bg-[#D00000]'
                  : 'bg-[#FFB703]'
              }`}
            />
          </div>

          {/* Name + role + location */}
          <div className="flex-1 min-w-0">
            <h3 className="text-black font-bold text-base leading-tight truncate">
              {fullName}
            </h3>

            {/* Role badge */}
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600/10 text-red-600 border border-red-600/20">
              {disciplineLabels[primaryDiscipline]}
            </span>

            {/* Location */}
            {locationCity && (
              <p className="mt-2 flex items-center gap-1 text-gray-400 text-xs">
                <PinIcon />
                <span className="truncate">{locationCity}</span>
              </p>
            )}
          </div>
        </div>

        {/* ── Availability badge ── */}
        <div>
          <AvailabilityBadge status={availabilityStatus} />
        </div>

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((ts) => (
              <MiniSkillTag key={ts.id || ts.skillId || ts.skill.id || ts.skill.name} name={ts.skill.name} />
            ))}
            {extraCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-auto pt-2">
          <Link
            href={`/talent/${id}`}
            className="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-red-600 border border-red-600/30 hover:bg-red-600/10 hover:border-red-600/60 transition-all duration-200 group-hover:shadow-[0_0_12px_rgba(230,57,70,0.15)]"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
