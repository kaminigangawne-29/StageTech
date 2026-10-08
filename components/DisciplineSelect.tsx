import React from 'react';
import { DISCIPLINES } from '@/lib/disciplines';

interface DisciplineSelectProps {
  value: string;
  onChange: (value: any) => void;
  includeAllOption?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
}

export default function DisciplineSelect({
  value,
  onChange,
  includeAllOption = false,
  placeholder = 'Select discipline',
  id,
  name,
  required = false,
  className = '',
}: DisciplineSelectProps) {
  return (
    <select
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`nb-input cursor-pointer ${className}`}
    >
      {includeAllOption ? (
        <option value="">All Disciplines</option>
      ) : (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {DISCIPLINES.map((d) => (
        <option key={d.value} value={d.value}>
          {d.label}
        </option>
      ))}
    </select>
  );
}
