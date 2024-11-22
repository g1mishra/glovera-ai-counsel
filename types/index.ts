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
  role: 'student' | 'admin';
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