"use client";

import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useSession } from "next-auth/react";

const baseFormSchema = z.object({
  undergraduate_degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University is required"),
  gpa: z.string().optional(),
  percentage: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Percentage must be between 0 and 100"),
  backlogs: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0;
  }, "Backlogs must be a non-negative number"),
  naac_grade: z.string().optional(),
  program_type: z.string().min(1, "Program type is required"),
  language_proficiency: z.object({
    test_type: z.string().min(1, "Test type is required"),
    overall_score: z.number().min(1, "Score is required"),
  }),
  work_experience_years: z.string(),
  technical_skills: z.array(z.string()).optional(),
  preferred_study_countries: z.array(z.string()).min(1, "Select at least one country"),
  target_intake: z.string().min(1, "Target intake is required"),
  budget_range: z.string().min(1, "Budget range is required"),
});

const editingFormSchema = baseFormSchema.extend({
  name: z.string().min(1, "Name is required"),
});

export const STUDY_COUNTRIES = ["United States"] as const;

export const PROGRAM_TYPES = ["Masters", "PhD"] as const;

export const NAAC_GRADES = ["A++", "A+", "A", "B++", "B+", "B", "C", "Not Applicable"] as const;

export const INTAKE_OPTIONS = [
  { value: "Spring 2026", label: "Spring 2026 (January 2026)" },
] as const;

export const BUDGET_RANGES = [
  {
    value: "2000000-3000000",
    label: "₹20,00,000 - ₹30,00,000 per year",
  },
  {
    value: "3000000-4000000",
    label: "₹30,00,000 - ₹40,00,000 per year",
  },
  {
    value: "4000000-5000000",
    label: "₹40,00,000 - ₹50,00,000 per year",
  },
  {
    value: "5000000+",
    label: "Above ₹50,00,000 per year",
  },
] as const;

interface FormErrors {
  [key: string]: string;
}

interface StudentProfileFormProps {
  user: User;
  onComplete?: () => void;
  submitLabel: string;
  mode: "onboarding" | "editing";
}

export default function StudentProfileForm({
  user,
  onComplete,
  submitLabel,
  mode,
}: StudentProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: user.name ?? "",
    undergraduate_degree: user.profile?.undergraduate_degree ?? "",
    university: user.profile?.university ?? "",
    gpa: user.profile?.gpa?.toString() ?? "",
    percentage: user.profile?.percentage?.toString() ?? "",
    backlogs: user.profile?.backlogs?.toString() ?? "0",
    naac_grade: user.profile?.naac_grade ?? "",
    program_type: user.profile?.program_type ?? "",
    language_proficiency: {
      test_type: (user.profile?.language_proficiency as any)?.test_type ?? "",
      overall_score: (user.profile?.language_proficiency as any)?.overall_score ?? "",
    },
    work_experience_years: user.profile?.work_experience_years?.toString() ?? "0",
    technical_skills: user.profile?.technical_skills ?? [],
    preferred_study_countries: user.profile?.preferred_study_countries ?? [],
    target_intake: user.profile?.target_intake ?? "",
    budget_range: user.profile?.budget_range ?? "",
  });

  const validateForm = () => {
    try {
      const schema = mode === "editing" ? editingFormSchema : baseFormSchema;

      // Convert string values to numbers where needed
      const validationData = {
        ...formData,
        gpa: formData.gpa ? formData.gpa : undefined,
        percentage: formData.percentage,
        backlogs: formData.backlogs,
        work_experience_years: formData.work_experience_years,
        language_proficiency: {
          ...formData.language_proficiency,
          overall_score: formData.language_proficiency.overall_score
            ? Number(formData.language_proficiency.overall_score)
            : undefined,
        },
      };

      schema.parse(validationData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        console.error("Validation errors:", newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
      if (mode === "editing") {
        const userResponse = await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name }),
        });

        if (!userResponse.ok) {
          throw new Error("Failed to update name");
        }
      }

      const profileResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          undergraduate_degree: formData.undergraduate_degree,
          university: formData.university,
          gpa: formData.gpa ? parseFloat(formData.gpa) : null,
          percentage: formData.percentage ? parseFloat(formData.percentage) : null,
          backlogs: parseInt(formData.backlogs),
          naac_grade: formData.naac_grade,
          program_type: formData.program_type,
          language_proficiency: {
            test_type: formData.language_proficiency.test_type,
            overall_score: parseFloat(formData.language_proficiency.overall_score),
          },
          work_experience_years: parseInt(formData.work_experience_years),
          technical_skills: formData.technical_skills || [],
          preferred_study_countries: formData.preferred_study_countries,
          target_intake: formData.target_intake,
          budget_range: formData.budget_range,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      await updateSession({
        ...user,
        name: formData.name,
        profile: {
          ...user.profile,
          ...formData,
        },
      });

      toast.success(
        mode === "onboarding" ? "Profile completed successfully" : "Profile updated successfully"
      );

      if (onComplete) {
        onComplete();
        router.refresh();
      } else if (mode === "onboarding") {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item: string) => item !== value),
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
    >
      {mode === "editing" && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#FF4B26] focus:ring-[#FF4B26]"
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="undergraduate_degree" className="block text-sm font-medium text-gray-700">
            Undergraduate Degree
          </label>
          <input
            id="undergraduate_degree"
            type="text"
            required
            placeholder="e.g., Bachelor of Engineering in Computer Science"
            value={formData.undergraduate_degree}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                undergraduate_degree: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.undergraduate_degree && (
            <p className="text-red-500 text-sm mt-1">{errors.undergraduate_degree}</p>
          )}
        </div>

        <div>
          <label htmlFor="university" className="block text-sm font-medium text-gray-700">
            University
          </label>
          <input
            id="university"
            type="text"
            required
            placeholder="University name"
            value={formData.university}
            onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
        </div>

        <div>
          <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
            GPA (out of 10, Indian system)
          </label>
          <input
            id="gpa"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.gpa}
            onChange={(e) => setFormData((prev) => ({ ...prev, gpa: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
        </div>

        <div>
          <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
            Percentage
          </label>
          <input
            id="percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            required
            value={formData.percentage}
            onChange={(e) => setFormData((prev) => ({ ...prev, percentage: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="backlogs" className="block text-sm font-medium text-gray-700">
          Number of Backlogs
        </label>
        <input
          id="backlogs"
          type="number"
          min="0"
          required
          value={formData.backlogs}
          onChange={(e) => setFormData((prev) => ({ ...prev, backlogs: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.backlogs && <p className="text-red-500 text-sm mt-1">{errors.backlogs}</p>}
      </div>

      <div>
        <label htmlFor="naac_grade" className="block text-sm font-medium text-gray-700">
          NAAC Grade
        </label>
        <select
          id="naac_grade"
          value={formData.naac_grade}
          onChange={(e) => setFormData((prev) => ({ ...prev, naac_grade: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select NAAC grade</option>
          {NAAC_GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        {errors.naac_grade && <p className="text-red-500 text-sm mt-1">{errors.naac_grade}</p>}
      </div>

      <div>
        <label htmlFor="program_type" className="block text-sm font-medium text-gray-700">
          Program Type
        </label>
        <select
          id="program_type"
          required
          value={formData.program_type}
          onChange={(e) => setFormData((prev) => ({ ...prev, program_type: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select program type</option>
          {PROGRAM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.program_type && <p className="text-red-500 text-sm mt-1">{errors.program_type}</p>}
      </div>

      <div>
        <label htmlFor="test_type" className="block text-sm font-medium text-gray-700">
          English Test Type
        </label>
        <select
          id="test_type"
          required
          value={formData.language_proficiency.test_type}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              language_proficiency: {
                ...prev.language_proficiency,
                test_type: e.target.value,
              },
            }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select test type</option>
          <option value="IELTS">IELTS</option>
          <option value="TOEFL">TOEFL</option>
          <option value="PTE">PTE</option>
        </select>
        {errors["language_proficiency.test_type"] && (
          <p className="text-red-500 text-sm mt-1">{errors["language_proficiency.test_type"]}</p>
        )}
      </div>

      <div>
        <label htmlFor="test_score" className="block text-sm font-medium text-gray-700">
          Test Score
        </label>
        <input
          id="test_score"
          type="number"
          step="0.1"
          required
          placeholder="Overall score"
          value={formData.language_proficiency.overall_score}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              language_proficiency: {
                ...prev.language_proficiency,
                overall_score: e.target.value,
              },
            }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors["language_proficiency.overall_score"] && (
          <p className="text-red-500 text-sm mt-1">
            {errors["language_proficiency.overall_score"]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="work_experience_years" className="block text-sm font-medium text-gray-700">
          Work Experience (years)
        </label>
        <input
          id="work_experience_years"
          type="number"
          min="0"
          value={formData.work_experience_years}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              work_experience_years: e.target.value,
            }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.work_experience_years && (
          <p className="text-red-500 text-sm mt-1">{errors.work_experience_years}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Study Countries
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STUDY_COUNTRIES.map((country) => (
            <label key={country} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferred_study_countries.includes(country)}
                onChange={(e) =>
                  handleArrayChange("preferred_study_countries", country, e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{country}</span>
            </label>
          ))}
        </div>
        {errors.preferred_study_countries && (
          <p className="text-red-500 text-sm mt-1">{errors.preferred_study_countries}</p>
        )}
      </div>

      <div>
        <label htmlFor="target_intake" className="block text-sm font-medium text-gray-700">
          Target Intake
        </label>
        <select
          id="target_intake"
          required
          value={formData.target_intake}
          onChange={(e) => setFormData((prev) => ({ ...prev, target_intake: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select intake</option>
          {INTAKE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.target_intake && (
          <p className="text-red-500 text-sm mt-1">{errors.target_intake}</p>
        )}
      </div>

      <div>
        <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700">
          Annual Budget (INR)
        </label>
        <select
          id="budget_range"
          required
          value={formData.budget_range}
          onChange={(e) => setFormData((prev) => ({ ...prev, budget_range: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select budget range</option>
          {BUDGET_RANGES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.budget_range && <p className="text-red-500 text-sm mt-1">{errors.budget_range}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
