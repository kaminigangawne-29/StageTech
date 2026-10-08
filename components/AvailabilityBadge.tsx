import React from 'react';
import { AvailabilityStatus } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────
interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
}

// ─── Config map ──────────────────────────────────────────────────────────────
const config: Record<
  AvailabilityStatus,
  { label: string; dotColor: string; textColor: string; bgColor: string; borderColor: string }
> = {
  AVAILABLE: {
    label: 'Available',
    dotColor: 'bg-[#1B9E5A]',
    textColor: 'text-[#1B9E5A]',
    bgColor: 'bg-[#1B9E5A]/10',
    borderColor: 'border-[#1B9E5A]/30',
  },
  BOOKED: {
    label: 'Booked',
    dotColor: 'bg-[#D00000]',
    textColor: 'text-[#D00000]',
    bgColor: 'bg-[#D00000]/10',
    borderColor: 'border-[#D00000]/30',
  },
  OPEN_TO_OFFERS: {
    label: 'Open to Offers',
    dotColor: 'bg-[#FFB703]',
    textColor: 'text-[#FFB703]',
    bgColor: 'bg-[#FFB703]/10',
    borderColor: 'border-[#FFB703]/30',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  const { label, dotColor, textColor, bgColor, borderColor } = config[status] || config.AVAILABLE;

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}
    >
      {/* Animated pulsing dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${dotColor}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      {label}
    </span>
  );
}
