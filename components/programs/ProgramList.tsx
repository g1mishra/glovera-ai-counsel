"use client";

import React from "react";
import ProgramCard from "./ProgramCard";
import { ProgramsGloveraFinal } from "@prisma/client";

interface ProgramListProps {
  programs: Array<ProgramsGloveraFinal>;
  loading?: boolean;
  error?: string;
}

const ProgramList: React.FC<ProgramListProps> = ({ programs, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-[#FF4B26] hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (!programs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No programs found matching your criteria.</p>
        <button onClick={() => window.location.reload()} className="text-[#FF4B26] hover:underline">
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {programs?.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
};

export default ProgramList;
