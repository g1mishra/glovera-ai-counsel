import ProgramDetail from "@/components/programs/ProgramDetail";
import { getBasePath } from "@/utils/getBasePath";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { programId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { programId } = await params;
    const program = await fetchProgramDetails(programId);
    return {
      title: `${program?.course_name} at ${program?.university_name} | Glovera`,
      description: program?.program_description,
    };
  } catch (error) {
    return {
      title: "Program Details | Glovera",
      description: "View detailed information about our educational programs",
    };
  }
}

async function fetchProgramDetails(programId: string) {
  if (!programId) return null;
  try {
    const response = await fetch(`${getBasePath()}/api/programs?programId=${programId}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch program details");
    }

    const data = await response.json();

    console.log(data);

    return data?.program || null;
  } catch (error) {
    console.error("Error fetching program details:", error);
    notFound();
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const program = await fetchProgramDetails(params?.programId);

  console.log(program);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProgramDetail program={program} />
      </main>
    </div>
  );
}
