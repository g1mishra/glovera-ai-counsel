import React from "react";
import { Metadata } from "next";
import ProgramsMain from "@/components/programs/ProgramsMain";

export const metadata: Metadata = {
  title: "Programs Explorer | Glovera",
  description:
    "Explore international education programs and find your perfect match",
};

async function getPrograms() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/programs`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export default async function Programs() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Explore Programs
        </h1>
        <ProgramsMain program={programs} />
      </main>
    </div>
  );
}
