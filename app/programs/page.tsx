import ProgramsMain from "@/components/programs/ProgramsMain";
import { getBasePath } from "@/utils/getBasePath";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs Explorer | Glovera",
  description:
    "Explore international education programs and find your perfect match",
};

interface ProgramsResponse {
  programs: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function getPrograms(page: number = 1, limit: number = 10) {
  try {
    const path = `${getBasePath()}/api/programs?page=${page}&limit=${limit}`;
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      console.error("Failed to fetch programs:", response.statusText);
      return {
        programs: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }

    const data: ProgramsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return {
      programs: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
}

export default async function Programs(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { programs, pagination } = await getPrograms(currentPage);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Explore Programs
        </h1>
        <ProgramsMain programs={programs} pagination={pagination} />
      </main>
    </div>
  );
}
