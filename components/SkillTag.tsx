import React from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────
interface SkillTagProps {
  name: string;
  onRemove?: () => void;
  small?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SkillTag({ name, onRemove, small = false }: SkillTagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        bg-red-600/10 text-red-600 border border-red-600/25
        transition-all duration-200
        ${small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${onRemove ? 'pr-1.5' : ''}
      `}
    >
      {/* Dot */}
      <span className={`rounded-full bg-red-600 flex-shrink-0 ${small ? 'w-1 h-1' : 'w-1.5 h-1.5'}`} />

      {/* Label */}
      <span>{name}</span>

      {/* Remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove skill ${name}`}
          className={`
            flex-shrink-0 flex items-center justify-center rounded-full
            text-red-600 hover:text-black hover:bg-red-600/30
            transition-colors duration-150
            ${small ? 'w-3.5 h-3.5' : 'w-4 h-4'}
          `}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-full h-full"
            stroke="currentColor"
          >
            <line x1="4" y1="4" x2="12" y2="12" strokeWidth={2} strokeLinecap="round" />
            <line x1="12" y1="4" x2="4" y2="12" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
