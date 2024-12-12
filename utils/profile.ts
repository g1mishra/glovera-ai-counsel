import { Profile } from "@prisma/client";

export function isProfileComplete(profile?: Profile | null): boolean {
  return Boolean(
    profile &&
      // Required academic details
      profile.undergraduate_degree &&
      profile.university &&
      profile.percentage !== null &&
      profile.backlogs !== null &&
      profile.program_type &&
      // Required test scores
      typeof profile.language_proficiency === "object" &&
      profile.language_proficiency !== null &&
      "test_type" in profile.language_proficiency &&
      "overall_score" in profile.language_proficiency &&
      // Required preferences
      profile.preferred_study_countries?.length > 0 &&
      profile.target_intake &&
      profile.budget_range

    // Optional fields not checked for completion:
    // - gpa (since percentage is primary)
    // - naac_grade
    // - work_experience_years
    // - technical_skills
    // - eligible_programs
  );
}
