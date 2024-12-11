import { Profile, ProgramsGloveraFinal } from "@prisma/client";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "student" | "admin";
  profile?: Profile;
}

export interface StudentProfile {
  high_school_percentage?: string;
  subjects_studied?: string[];
  language_proficiency?: string;
  undergraduate_degree?: string;
  gpa?: string;
  work_experience?: string;
  technical_skills?: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ProgramFilterParams {
  degree_type?: string;
  location?: string;
  budget_range?: string;
}

export interface ConsultationBooking {
  student_id: string;
  date: string;
  time_slot: string;
  consultation_type: "video" | "chat";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  content: string;
  timestamp: Date;
  type: "text" | "recommendation" | "program_info";
}

export interface VideoSession {
  id: string;
  student_id: string;
  counselor_id?: string;
  status: "scheduled" | "in_progress" | "completed";
  start_time: Date;
  end_time?: Date;
  recording_url?: string;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export interface ConsultationFormData {
  name: string;
  email: string;
  preferred_date: string;
  time_slot: string;
  consultation_type: "video" | "chat";
  current_education: string;
  areas_of_interest: string[];
  additional_notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProgramCardProps {
  program: ProgramsGloveraFinal;
  onApply?: (programId: string) => void;
}

export interface ProgramListProps {
  programs: Array<ProgramsGloveraFinal>;
  loading?: boolean;
  error?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProgramFilterParams) => void;
  initialFilters?: ProgramFilterParams;
}

export interface FilterProps {
  filters: ProgramFilterParams;
  onChange: (filters: ProgramFilterParams) => void;
}

export interface AdminDashboardStats {
  total_students: number;
  total_programs: number;
  active_consultations: number;
  conversion_rate: number;
  popular_programs: Array<{
    program: ProgramsGloveraFinal;
    applications: number;
  }>;
}

export interface UserProfile {
  id: string;
  userId: string;
  undergraduate_degree?: string | null;
  university?: string | null;
  gpa?: string | null;
  language_proficiency?: {
    test_type: string;
    overall_score: string;
  } | null;
  work_experience_years?: string | null;
  technical_skills: string[];
  preferred_study_countries: string[];
  target_intake?: string | null;
  budget_range?: string | null;
}

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "archived" | "deleted";
}

export interface ProgramsMainProps {
  programs: Array<ProgramsGloveraFinal>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  path: string;
}
