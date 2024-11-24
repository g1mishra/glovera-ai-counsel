"use client";

import { Program } from "@/types";
import { getBasePath } from "@/utils/getBasePath";
import { Edit, GraduationCap, Loader2, MapPin, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import AddProgramModal from "./ProgramModals";
import { useRouter } from "next/navigation";

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
  program: Program | null;
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
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Delete Program</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete "{program?.course_name}"? This action cannot be
                undone.
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
  programs: Program[];
  loading: boolean;
  error: string;
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleEditClick = (program: Program) => {
    setSelectedProgram(program);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (program: Program) => {
    setSelectedProgram(program);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProgram) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting program...");

    try {
      const response = await fetch(`${getBasePath()}/api/programs?id=${selectedProgram.id}`, {
        method: "DELETE",
      });

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

  const getStatusBadge = (deadline: string, notActive = false) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    if (notActive || deadlineDate < today) {
      return { text: "In-Active", classes: "bg-red-100 text-red-800" };
    }

    const daysUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDeadline <= 30) {
      return { text: "Closing Soon", classes: "bg-yellow-100 text-yellow-800" };
    }

    return { text: "Active", classes: "bg-green-100 text-green-800" };
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-500">
                  Course & University
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Location</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Duration & Fees</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Intake & Deadline</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Status</th>
                <th className="text-right py-4 px-6 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500">Loading programs...</span>
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
                  <tr key={program.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{program.course_name}</span>
                        <span className="text-sm text-gray-500 flex items-center mt-1">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          {program.university_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {program.university_location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{program.duration}</span>
                        <span className="text-sm text-gray-500">{program.tuition_fee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-900">Intake: {program.start_date}</span>
                        <span className="text-sm text-gray-500">
                          Deadline: {program.apply_date}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusBadge(program.apply_date, program.isActive === false)
                            .classes
                        }`}
                      >
                        {
                          getStatusBadge(program.apply_date, program.isActive === false)
                            .text
                        }
                      </span>
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
