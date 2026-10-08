export type UserRole = 'TECHNICIAN' | 'PRODUCTION' | 'ADMIN';
export type AvailabilityStatus = 'AVAILABLE' | 'OPEN_TO_OFFERS' | 'BOOKED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'LINK' | 'PDF';
export type JobStatus = 'OPEN' | 'FILLED' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type Discipline =
  | 'LIGHTING_DESIGNER'
  | 'LIGHTING_OPERATOR'
  | 'SOUND_DESIGNER'
  | 'SOUND_OPERATOR'
  | 'ART_DIRECTOR'
  | 'COSTUME_DESIGNER'
  | 'SET_DESIGNER'
  | 'STAGE_MANAGER'
  | 'PRODUCTION_MANAGER'
  | 'PUBLIC_RELATIONS'
  | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  fullName: string;
  bio?: string;
  locationCity?: string;
  primaryDiscipline?: string;
  secondaryDisciplines: string[];
  availabilityStatus: AvailabilityStatus;
  skills: string[];
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  profileImageUrl?: string;
}

export interface ProductionProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

export interface PortfolioItem {
  id: string;
  technicianId?: string;
  title: string;
  description?: string | null;
  mediaUrl: string;
  url?: string;
  thumbnailUrl?: string;
  mediaType: MediaType;
  sortOrder: number;
  order?: number;
  createdAt?: string;
}

export interface ProductionHistory {
  id: string;
  technicianId?: string;
  showTitle: string;
  company?: string | null;
  roleHeld: string;
  role?: string;
  venue?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  companyName: string;
  roleNeeded: string;
  startDate: string;
  endDate?: string;
  budget?: string;
  location: string;
  skillsRequired: string[];
  status: JobStatus;
  createdAt: string;
  applicantCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessageData {
  id: string;
  senderId: string;
  receiverId?: string;
  content: string;
  createdAt: string | Date;
  sentAt?: string | Date;
  readAt?: string | Date | null;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface TechnicianFilters {
  discipline: Discipline | '';
  location: string;
  availability: AvailabilityStatus[];
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
}

export interface TechnicianSkill {
  id?: string;
  technicianId?: string;
  skillId?: string;
  skill: Skill;
}
