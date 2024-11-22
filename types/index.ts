export interface EligibilityCriteria {
  high_school_percentage?: string;
  subjects_required: string[];
  language_proficiency?: string;
  undergraduate_degree?: string;
  minimum_gpa?: string;
  work_experience?: string;
  technical_skills?: string[];
}

export interface Program {
  _id?: string;
  program_name: string;
  degree_type: string;
  duration: string;
  eligibility_criteria: EligibilityCriteria;
  tuition_fee: string;
  program_start_date: string;
  program_description: string;
}

export interface University {
  _id?: string;
  university_name: string;
  location: string;
  programs: Program[];
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: "student" | "admin";
  profile?: StudentProfile;
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
  duration?: string;
  location?: string;
  tuition_range?: {
    min: number;
    max: number;
  };
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

export interface ProgramRecommendation {
  program: Program;
  university: University;
  match_score: number;
  match_reasons: string[];
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
  program: Program;
  university: University;
  onApply?: (programId: string) => void;
}

export interface ProgramListProps {
  programs: Array<Program & { university: University }>;
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
    program: Program;
    applications: number;
  }>;
}
