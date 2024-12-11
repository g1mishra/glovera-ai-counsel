"use client";

import { ProgramsGloveraFinal } from "@prisma/client";
import { Clock, GraduationCap, IndianRupee, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ProgramCardProps {
  program: ProgramsGloveraFinal;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 flex flex-col h-full">
      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{program.program_name}</h3>
            <p className="text-[#FF4B26] font-medium">{program.type_of_program}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>{program.university}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{program.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{program.can_finish_in}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <IndianRupee className="w-4 h-4 mr-2" />
            <span>{program.glovera_pricing.toLocaleString()} INR</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Key Requirements:</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Minimum GPA: {program.min_gpa}%</li>
            <li>Work Experience: {program.min_work_exp} years</li>
            <li>Backlogs: {program.backlog}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/programs/${program.id}`}
          className="block w-full px-4 py-2 text-center bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
