"use client";

import StudentProfileForm from "@/components/shared/StudentProfileForm";
import { User } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function ProfileForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);

  const language_proficiency = user.profile?.language_proficiency as any;

  if (!isEditing) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#FF4B26] hover:text-[#E63E1C]"
            >
              Edit Profile
            </button>
          </div>

          <div className="flex items-center space-x-6">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Email and profile photo are managed through your Google account
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Undergraduate Degree</label>
            <p className="mt-1 text-gray-900">
              {user.profile?.undergraduate_degree || "Not specified"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <p className="mt-1 text-gray-900">{user.profile?.university || "Not specified"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">GPA</label>
            <p className="mt-1 text-gray-900">{user.profile?.gpa || "Not specified"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Percentage</label>
            <p className="mt-1 text-gray-900">{user.profile?.percentage || "Not specified"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Backlogs</label>
            <p className="mt-1 text-gray-900">{user.profile?.backlogs || "Not specified"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NAAC Grade</label>
            <p className="mt-1 text-gray-900">{user.profile?.naac_grade || "Not specified"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Program Type</label>
            <p className="mt-1 text-gray-900">{user.profile?.program_type || "Not specified"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language Proficiency</label>
            <p className="mt-1 text-gray-900">
              {language_proficiency?.test_type
                ? `${language_proficiency?.test_type}: ${language_proficiency.overall_score}`
                : "Not specified"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Work Experience</label>
            <p className="mt-1 text-gray-900">
              {user.profile?.work_experience_years
                ? `${user.profile.work_experience_years} years`
                : "Not specified"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.profile?.technical_skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Countries</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.profile?.preferred_study_countries?.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Intake</label>
                <p className="mt-1 text-gray-900">
                  {user.profile?.target_intake || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                <p className="mt-1 text-gray-900">
                  {user.profile?.budget_range || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-gray-900">
          Cancel
        </button>
      </div>
      <StudentProfileForm
        user={user}
        onComplete={() => setIsEditing(false)}
        submitLabel="Save Changes"
        mode="editing"
      />
    </div>
  );
}
