import React from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────
interface LoadingSkeletonProps {
  type: 'card' | 'profile' | 'list';
  count?: number;
}

// ─── Pulse block helper ───────────────────────────────────────────────────────
function Pulse({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.04] ${className}`}
    />
  );
}

// ─── Card Skeleton (matches TechnicianCard) ───────────────────────────────────
function CardSkeleton() {
  return (
    <div className="flex flex-col bg-[#FFFFFF] border border-[#111111] rounded-2xl overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-white/[0.04] animate-pulse" />

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Pulse className="w-20 h-20 rounded-2xl flex-shrink-0" />

          <div className="flex-1 space-y-2.5 pt-1">
            {/* Name */}
            <Pulse className="h-4 w-3/4" />
            {/* Role badge */}
            <Pulse className="h-5 w-1/2 rounded-full" />
            {/* Location */}
            <Pulse className="h-3.5 w-2/5 mt-3" />
          </div>
        </div>

        {/* Availability badge */}
        <Pulse className="h-6 w-28 rounded-full" />

        {/* Skills */}
        <div className="flex gap-1.5">
          <Pulse className="h-5 w-16 rounded-full" />
          <Pulse className="h-5 w-20 rounded-full" />
          <Pulse className="h-5 w-12 rounded-full" />
        </div>

        {/* CTA */}
        <Pulse className="h-10 w-full rounded-xl mt-auto" />
      </div>
    </div>
  );
}

// ─── Profile Skeleton ─────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="bg-[#FFFFFF] border border-[#111111] rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <Pulse className="w-28 h-28 rounded-2xl flex-shrink-0" />

          <div className="flex-1 space-y-3 pt-1 w-full">
            {/* Name */}
            <Pulse className="h-7 w-56" />
            {/* Role */}
            <Pulse className="h-5 w-36 rounded-full" />
            {/* Badges row */}
            <div className="flex gap-2 pt-1">
              <Pulse className="h-6 w-24 rounded-full" />
              <Pulse className="h-6 w-20 rounded-full" />
            </div>
            {/* Location */}
            <Pulse className="h-4 w-32" />
          </div>

          {/* CTA */}
          <Pulse className="w-full md:w-36 h-10 rounded-xl flex-shrink-0" />
        </div>

        {/* Bio */}
        <div className="mt-6 space-y-2">
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-5/6" />
          <Pulse className="h-4 w-4/5" />
          <Pulse className="h-4 w-3/4" />
        </div>

        {/* Skills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Pulse key={i} className={`h-7 rounded-full ${i % 3 === 0 ? 'w-20' : i % 3 === 1 ? 'w-28' : 'w-16'}`} />
          ))}
        </div>
      </div>

      {/* Portfolio section */}
      <div className="space-y-4">
        <Pulse className="h-6 w-36" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      </div>

      {/* Timeline section */}
      <div className="space-y-4">
        <Pulse className="h-6 w-44" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Pulse className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" />
              <div className="flex-1 bg-[#FFF4D6] border border-[#111111] rounded-xl p-4 space-y-2">
                <Pulse className="h-4 w-3/5" />
                <div className="flex gap-2">
                  <Pulse className="h-3.5 w-28" />
                  <Pulse className="h-3.5 w-20" />
                </div>
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── List Skeleton ────────────────────────────────────────────────────────────
function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-[#FFFFFF] border border-[#111111] rounded-xl p-4"
        >
          {/* Avatar */}
          <Pulse className="w-12 h-12 rounded-xl flex-shrink-0" />

          <div className="flex-1 space-y-2">
            {/* Name + status row */}
            <div className="flex items-center justify-between">
              <Pulse className={`h-4 ${i % 2 === 0 ? 'w-36' : 'w-44'}`} />
              <Pulse className="h-5 w-20 rounded-full" />
            </div>
            {/* Meta row */}
            <div className="flex gap-3">
              <Pulse className="h-3 w-24 rounded-full" />
              <Pulse className="h-3 w-16 rounded-full" />
            </div>
          </div>

          {/* Action */}
          <Pulse className="w-24 h-8 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoadingSkeleton({ type, count = 6 }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return <ProfileSkeleton />;
  }

  return <ListSkeleton />;
}
