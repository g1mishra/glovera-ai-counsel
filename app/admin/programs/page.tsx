import React from "react";
import { Metadata } from "next";
import ProgramList from "@/components/admin/programs/ProgramList";
import ProgramHeader from "@/components/admin/programs/ProgramHeader";

export const metadata: Metadata = {
  title: "Program Management | Admin Dashboard",
  description: "Manage university programs and eligibility criteria",
};

export default function ProgramManagement() {
  return (
    <div className="space-y-6">
      <ProgramHeader />
      <ProgramList />
    </div>
  );
}
