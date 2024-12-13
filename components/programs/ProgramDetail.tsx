"use client";

import { ProgramsGloveraFinal } from "@prisma/client";
import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  DollarSign,
  MapPin,
  Percent,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface ProgramDetailProps {
  program: ProgramsGloveraFinal;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  return (
    <div className="space-y-8 text-gray-900">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {program.program_name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              <span>{program.university}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{program.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{program.can_finish_in}</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              <span>Rank: {program.ranking}</span>
            </div>
          </div>

          {/* Add new pricing section here */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Program Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-600">Original Price</span>
                <span className="text-xl font-bold line-through text-gray-500">
                  ${program.original_pricing.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Glovera Price</span>
                <span className="text-xl font-bold text-[#FF4B26]">
                  ${program.glovera_pricing.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Your Savings</span>
                <span className="text-xl font-bold text-green-600">
                  ${program.savings.toLocaleString()} ({program.savings_percent}
                  %)
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/get-started`}
            className="inline-block px-6 py-3 bg-[#FF4B26] text-white font-semibold rounded-lg hover:bg-[#E63E1C] transition-colors"
          >
            Talk to an Advisor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold mb-4">Program Highlights</h2>
          <div className="space-y-4">
            {program.program_top_usp && (
              <div className="flex items-start">
                <Award className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
                <p className="text-gray-600">{program.program_top_usp}</p>
              </div>
            )}
            {program.possible_specializations_or_concentrations && (
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Specializations</h3>
                  <p className="text-gray-600">
                    {program.possible_specializations_or_concentrations}
                  </p>
                </div>
              </div>
            )}
            {program.co_op_internship && (
              <div className="flex items-start">
                <Briefcase className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Internship Opportunities</h3>
                  <p className="text-gray-600">{program.co_op_internship}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold mb-4">Program Structure</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Credits Distribution</h3>
                <p className="text-gray-600">
                  Total Credits: {program.total_credits}
                </p>
                <p className="text-gray-600">
                  IIT/IIM Credits: {program.credits_in_iit_or_iim}
                </p>
                <p className="text-gray-600">
                  US Credits: {program.credits_in_us}
                </p>
              </div>
            </div>
            {program.curriculum && (
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Curriculum Overview</h3>
                  {program.curriculum.startsWith("http") ? (
                    <a
                      href={program.curriculum}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF4B26] underline"
                    >
                      {program.curriculum}
                    </a>
                  ) : (
                    <p className="text-gray-600">{program.curriculum}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Eligibility Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {program.minimum_qualifications && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Minimum Qualifications</h3>
                <p className="text-gray-600">
                  {program.minimum_qualifications}
                </p>
              </div>
            </div>
          )}
          {program.ug_background && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">UG Background</h3>
                <p className="text-gray-600">{program.ug_background}</p>
              </div>
            </div>
          )}
          {program.min_gpa && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Minimum GPA</h3>
                <p className="text-gray-600">
                  {program.min_gpa} ({program.gpa_type})
                </p>
              </div>
            </div>
          )}
          {program.min_work_exp !== null && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Work Experience</h3>
                <p className="text-gray-600">
                  {program.min_work_exp} years minimum
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Application Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Transcript Evaluation",
              value: program.transcript_evaluation,
            },
            { label: "Letters of Recommendation", value: program.LOR },
            { label: "Statement of Purpose", value: program.SOP },
            { label: "Interviews", value: program.interviews },
          ].map(
            (item, index) =>
              item.value && (
                <div key={index} className="flex items-start">
                  <FileText className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-gray-600">{item.value}</p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {program.key_companies_hiring && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold mb-4">Career Opportunities</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Key Job Roles</h3>
                <p className="text-gray-600">{program.key_job_roles}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Building className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Top Hiring Companies</h3>
                <div className="text-gray-600">
                  {typeof program.key_companies_hiring === "object" &&
                    JSON.stringify(program.key_companies_hiring, null, 2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramDetail;
