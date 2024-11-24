"use client";

import React from "react";
import { Calendar, Clock, DollarSign, GraduationCap, MapPin } from "lucide-react";
import { Program } from "@/types";
import Link from "next/link";

interface ProgramCardProps {
  program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{program.course_name}</h3>
            <p className="text-[#FF4B26] font-medium">{program.degree_type}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>{program.university_name}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{program.university_location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Starts {program.start_date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{program.tuition_fee}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Key Requirements:</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            {program.min_gpa && <li>Minimum GPA: {program.min_gpa}</li>}
            {program.english_requirments.ielts && <li>{program.english_requirments.ielts}</li>}
            {program.work_experience && <li>{program.work_experience} work experience</li>}
          </ul>
        </div>

        <div className="flex pt-4">
          <Link
            href={`/programs/${program.id}`}
            className="flex-1 px-4 py-2 text-center bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
