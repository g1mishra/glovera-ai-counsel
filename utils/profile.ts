import { UserProfile } from "@/types";

export function isProfileComplete(profile?: UserProfile | null): boolean {
  return Boolean(
    profile &&
      profile.undergraduate_degree &&
      profile.gpa &&
      profile.language_proficiency?.test_type &&
      profile.language_proficiency?.overall_score &&
      // profile.technical_skills?.length &&
      profile.preferred_study_countries?.length &&
      profile.target_intake &&
      profile.budget_range
  );
}
