import ProgramsMain from "@/components/programs/ProgramsMain";
import { getPrograms } from "@/services/program.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs Explorer | Glovera",
  description: "Explore international education programs and find your perfect match",
};

export default async function Programs(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { programs, pagination } = await getPrograms(currentPage);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Programs</h1>
        <ProgramsMain programs={programs} pagination={pagination} />
      </main>
    </div>
  );
}
