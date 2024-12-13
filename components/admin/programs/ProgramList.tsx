"use client";

import { getBasePath } from "@/utils/getBasePath";
import { Edit, GraduationCap, Loader2, MapPin, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import AddProgramModal from "./ProgramModals";
import { useRouter } from "next/navigation";
import { ProgramsGloveraFinal } from "@prisma/client";

const DeleteAlert = ({
  isOpen,
  onClose,
  onConfirm,
  program,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  program: ProgramsGloveraFinal | null;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-lg">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Delete Program
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete "{program?.program_name}"? This
                action cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete Program"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgramList = ({
  programs,
  loading,
  error,
  setPrograms,
}: {
  programs: ProgramsGloveraFinal[];
  loading: boolean;
  error: string;
  setPrograms: React.Dispatch<React.SetStateAction<ProgramsGloveraFinal[]>>;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] =
    useState<ProgramsGloveraFinal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleEditClick = (program: ProgramsGloveraFinal) => {
    setSelectedProgram(program);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (program: ProgramsGloveraFinal) => {
    setSelectedProgram(program);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProgram) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting program...");

    try {
      const response = await fetch(
        `${getBasePath()}/api/programs?id=${selectedProgram.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete program");
      }

      setPrograms((prev) => prev.filter((p) => p.id !== selectedProgram.id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program", { id: toastId });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedProgram(null);
    }
  };

  const handleModalClose = (shouldRefetch?: boolean) => {
    setIsEditModalOpen(false);
    setSelectedProgram(null);
    console.log("shouldRefetch", shouldRefetch);
    if (shouldRefetch) {
      router.refresh();
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-500">
                  Program & University
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">
                  Details
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">
                  Pricing & Duration
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">
                  Requirements
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500">
                        Loading programs...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No programs found
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr
                    key={program.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {program.program_name}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center mt-1">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          {program.university}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {program.college}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {program.location}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {program.possible_specializations_or_concentrations ||
                            "No specializations listed"}
                        </span>
                        {program.program_top_usp && (
                          <span className="text-xs text-blue-600 mt-1">
                            USP: {program.program_top_usp}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium">
                            ${program.glovera_pricing}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ${program.original_pricing}
                          </span>
                        </div>
                        <span className="text-xs text-green-600">
                          Save {program.savings_percent}%
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          {program.can_finish_in} • {program.total_credits}{" "}
                          credits
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-600">
                          Min GPA: {program.min_gpa || "N/A"} (
                          {program.gpa_type || "Not specified"})
                        </span>
                        <span className="text-gray-600">
                          Work Exp: {program.min_work_exp || 0}+ years
                        </span>
                        {program.backlog !== null && (
                          <span className="text-gray-600">
                            Max Backlogs: {program.backlog}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full line-clamp-1 text-xs font-medium bg-blue-100 text-blue-800">
                          {program.type_of_program || "N/A"}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {program.public_private}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => handleEditClick(program)}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => handleDeleteClick(program)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {isEditModalOpen && selectedProgram && (
          <AddProgramModal
            isAddModalOpen={isEditModalOpen}
            onCloseAddModal={handleModalClose}
            mode="edit"
            programData={selectedProgram}
          />
        )}
      </div>
      <DeleteAlert
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProgram(null);
        }}
        onConfirm={handleDeleteConfirm}
        program={selectedProgram}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ProgramList;
