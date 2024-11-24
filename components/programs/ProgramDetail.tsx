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
import { Program } from "@/types";

interface ProgramDetailProps {
  program: Program;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ program }) => {
  return (
    <div className="space-y-8 text-gray-900">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.course_name}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>{program.degree_type || program.university_name}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{program.university_location}</span>
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
              <span>Starts {program.start_date}</span>
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

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
        <p className="text-gray-600 whitespace-pre-line">{program.program_description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold mb-4">Eligibility Requirements</h2>
        <div className="space-y-4">
          {program.min_gpa && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Minimum GPA</h3>
                <p className="text-gray-600">{program.min_gpa}</p>
              </div>
            </div>
          )}
          {program.degree_type && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Education Background</h3>
                <p className="text-gray-600">{program.degree_type}</p>
              </div>
            </div>
          )}
          {Object.keys(program?.english_requirments || {}).length > 0 &&
            Object.keys(program?.english_requirments || {}).map((key) => (
              <div className="flex items-start" key={key}>
                <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">{key}</h3>
                  <p className="text-gray-600">
                    {program.english_requirments[key as keyof typeof program.english_requirments]}
                  </p>
                </div>
              </div>
            ))}
          {program.work_experience && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Work Experience</h3>
                <p className="text-gray-600">{program.work_experience}</p>
              </div>
            </div>
          )}
          {program.work_experience && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#FF4B26] mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Work Experience</h3>
                <p className="text-gray-600">{program.work_experience}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
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
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
