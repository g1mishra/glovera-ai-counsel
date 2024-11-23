"use client";

import React from "react";
import { Program } from "@/types";
import { Edit, Trash2 } from "lucide-react";

const ProgramList = () => {
  const programs: Partial<Program>[] = [
    {
      _id: "1",
      program_name: "Master of Computer Science",
      degree_type: "Master's Degree",
      duration: "2 years",
      program_start_date: "Sep 2024",
      eligibility_criteria: {
        minimum_gpa: "3.0",
        subjects_required: ["Computer Science", "Mathematics"],
        language_proficiency: "IELTS 6.5",
      },
      tuition_fee: "$25,000/year",
    },
    {
      _id: "2",
      program_name: "Bachelor of Business Administration",
      degree_type: "Bachelor's Degree",
      duration: "4 years",
      program_start_date: "Sep 2024",
      eligibility_criteria: {
        minimum_gpa: "2.5",
        subjects_required: ["Mathematics", "English"],
        language_proficiency: "IELTS 6.0",
      },
      tuition_fee: "$20,000/year",
    },
    {
      _id: "3",
      program_name: "PhD in Data Science",
      degree_type: "Doctorate",
      duration: "3-4 years",
      program_start_date: "Jan 2025",
      eligibility_criteria: {
        minimum_gpa: "3.5",
        subjects_required: ["Statistics", "Computer Science"],
        language_proficiency: "IELTS 7.0",
      },
      tuition_fee: "$30,000/year",
    },
    {
      _id: "4",
      program_name: "Master of Business Analytics",
      degree_type: "Master's Degree",
      duration: "1.5 years",
      program_start_date: "Jan 2025",
      eligibility_criteria: {
        minimum_gpa: "3.0",
        subjects_required: ["Mathematics", "Statistics"],
        language_proficiency: "IELTS 6.5",
      },
      tuition_fee: "$28,000/year",
    },
    {
      _id: "5",
      program_name: "Bachelor of Computer Engineering",
      degree_type: "Bachelor's Degree",
      duration: "4 years",
      program_start_date: "Sep 2024",
      eligibility_criteria: {
        minimum_gpa: "2.8",
        subjects_required: ["Physics", "Mathematics"],
        language_proficiency: "IELTS 6.0",
      },
      tuition_fee: "$22,000/year",
    },
  ];

  const getStatusBadge = (index: number) => {
    // Alternate between different statuses for demonstration
    const statuses = [
      { text: "Active", classes: "bg-green-100 text-green-800" },
      { text: "Inactive", classes: "bg-red-100 text-red-800" },
      { text: "Draft", classes: "bg-yellow-100 text-yellow-800" },
      { text: "Archived", classes: "bg-gray-100 text-gray-800" },
    ];
    return statuses[index % statuses.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-medium text-gray-500">
                PROGRAM NAME
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">
                DEGREE TYPE
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">
                DURATION
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">
                START DATE
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">
                STATUS
              </th>
              <th className="text-right py-4 px-6 font-medium text-gray-500">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {programs.map((program, index) => (
              <tr
                key={program._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {program.program_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      Tuition: {program.tuition_fee}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500">
                  {program.degree_type}
                </td>
                <td className="py-4 px-6 text-gray-500">{program.duration}</td>
                <td className="py-4 px-6 text-gray-500">
                  {program.program_start_date}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusBadge(index).classes
                    }`}
                  >
                    {getStatusBadge(index).text}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="action-btn text-gray-600 hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="action-btn text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to 5 of 5 results
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button
              className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramList;
