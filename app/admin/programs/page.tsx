import ProgramsAdminView from "@/components/admin/programs/ProgramsAdminView";
import { getPrograms } from "@/services/program.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program Management | Admin Dashboard",
  description: "Manage university programs and eligibility criteria",
};

export default async function ProgramManagement(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { programs, pagination } = await getPrograms(currentPage);

  return <ProgramsAdminView programs={programs} pagination={pagination} />;
}
