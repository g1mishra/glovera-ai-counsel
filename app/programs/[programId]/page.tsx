import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetail from "@/components/programs/ProgramDetail";

interface Props {
  params: { programId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const program = await fetchProgramDetails(params.programId);
    return {
      title: `${program.program_name} at ${program.university.university_name} | Glovera`,
      description: program.program_description,
    };
  } catch (error) {
    return {
      title: "Program Details | Glovera",
      description: "View detailed information about our educational programs",
    };
  }
}

async function fetchProgramDetails(programId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/programs/${programId}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch program details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching program details:", error);
    notFound();
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const program = await fetchProgramDetails(params.programId);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProgramDetail program={program} />
      </main>
    </div>
  );
}
