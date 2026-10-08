// Single source of truth for theatre disciplines used across the app.
export const DISCIPLINES = [
  { value: 'LIGHTING_DESIGNER', label: 'Lighting Designer', group: 'Light' },
  { value: 'LIGHTING_OPERATOR', label: 'Lighting Operator', group: 'Light' },
  { value: 'SOUND_DESIGNER', label: 'Sound Designer', group: 'Sound' },
  { value: 'SOUND_OPERATOR', label: 'Sound Operator', group: 'Sound' },
  { value: 'ART_DIRECTOR', label: 'Art Director', group: 'Design' },
  { value: 'COSTUME_DESIGNER', label: 'Costume Designer', group: 'Design' },
  { value: 'SET_DESIGNER', label: 'Set Designer', group: 'Design' },
  { value: 'STAGE_MANAGER', label: 'Stage Manager', group: 'Management' },
  { value: 'PRODUCTION_MANAGER', label: 'Production Manager', group: 'Management' },
  { value: 'PUBLIC_RELATIONS', label: 'Public Relations', group: 'Management' },
  { value: 'OTHER', label: 'Other', group: 'Other' },
] as const;

export function disciplineLabel(value?: string | null): string {
  if (!value) return 'Technician';
  const found = DISCIPLINES.find((d) => d.value === value);
  if (found) return found.label;
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Bright neobrutalist colour per discipline
export function disciplineColor(value?: string | null): string {
  switch (value) {
    case 'LIGHTING_DESIGNER': return '#FFD60A';
    case 'LIGHTING_OPERATOR': return '#FFE98A';
    case 'SOUND_DESIGNER': return '#3A86FF';
    case 'SOUND_OPERATOR': return '#9CC2FF';
    case 'ART_DIRECTOR': return '#C8B6FF';
    case 'COSTUME_DESIGNER': return '#FF8FAB';
    case 'SET_DESIGNER': return '#FFB703';
    case 'STAGE_MANAGER': return '#7AE582';
    case 'PRODUCTION_MANAGER': return '#B5E48C';
    case 'PUBLIC_RELATIONS': return '#FF9F68';
    default: return '#E5E5E5';
  }
}

export const MUMBAI_AREAS = [
  'Mumbai', 'Andheri', 'Bandra', 'Juhu', 'Prithvi Theatre, Juhu', 'NCPA, Nariman Point',
  'Dadar', 'Borivali', 'Powai', 'Thane', 'Navi Mumbai', 'Pune',
];
