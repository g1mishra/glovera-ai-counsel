"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  MapPin,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Program, University } from "@/types";

interface ProgramDetailProps {
  program: Program & { university: University };
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {program.program_name}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>{program.university.university_name}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{program.university.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>{program.tuition_fee}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Starts {program.program_start_date}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/programs/${program._id}/apply`}
              className="px-6 py-3 bg-[#FF4B26] text-white font-semibold rounded-lg hover:bg-[#E63E1C] transition-colors"
            >
              Apply Now
            </Link>
            <button
              onClick={() => {
                /* Add to wishlist logic */
              }}
              className="px-6 py-3 border border-[#FF4B26] text-[#FF4B26] font-semibold rounded-lg hover:bg-[#FFF5F3] transition-colors"
            >
              Save Program
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
        <p className="text-gray-600 whitespace-pre-line">
          {program.program_description}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Eligibility Requirements
        </h2>
        <div className="space-y-4">
          {program.eligibility_criteria.minimum_gpa && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Minimum GPA</h3>
                <p className="text-gray-600">
                  {program.eligibility_criteria.minimum_gpa}
                </p>
              </div>
            </div>
          )}
          {program.eligibility_criteria.undergraduate_degree && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Education Background</h3>
                <p className="text-gray-600">
                  {program.eligibility_criteria.undergraduate_degree}
                </p>
              </div>
            </div>
          )}
          {program.eligibility_criteria.language_proficiency && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Language Requirements</h3>
                <p className="text-gray-600">
                  {program.eligibility_criteria.language_proficiency}
                </p>
              </div>
            </div>
          )}
          {program.eligibility_criteria.work_experience && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Work Experience</h3>
                <p className="text-gray-600">
                  {program.eligibility_criteria.work_experience}
                </p>
              </div>
            </div>
          )}
          {program.eligibility_criteria.technical_skills && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Required Technical Skills</h3>
                <ul className="text-gray-600 list-disc list-inside ml-4">
                  {program.eligibility_criteria.technical_skills.map(
                    (skill, index) => (
                      <li key={index}>{skill}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Application Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
            <div>
              <h3 className="font-medium">Required Documents</h3>
              <ul className="text-gray-600 list-disc list-inside ml-4">
                <li>Academic transcripts</li>
                <li>Language proficiency test scores</li>
                <li>Resume/CV</li>
                <li>Statement of purpose</li>
                <li>Letters of recommendation</li>
              </ul>
            </div>
          </div>
          <Link
            href={`/programs/${program._id}/apply`}
            className="inline-block px-6 py-3 bg-[#FF4B26] text-white font-semibold rounded-lg hover:bg-[#E63E1C] transition-colors"
          >
            Start Application
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
