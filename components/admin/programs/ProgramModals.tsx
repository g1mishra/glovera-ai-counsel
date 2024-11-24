import React, { useEffect, useState } from "react";
import {
  School,
  Calendar,
  DollarSign,
  Languages,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  Clock,
  Loader2,
} from "lucide-react";
import Modal from "@/components/common/Modal";
import { Program } from "@/types";
import { getBasePath } from "@/utils/getBasePath";
import toast from "react-hot-toast";

type ProgramModalsProps = {
  isAddModalOpen: boolean;
  onCloseAddModal: (shouldRefetch?: boolean) => void;
  mode?: "edit" | "add";
  programData?: Program;
};

const InputField = ({ label, icon: Icon, ...props }: any) => (
  <div className="group">
    <div className="flex items-center mb-1">
      <Icon className="h-4 w-4 text-gray-500 mr-2" />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
    <input
      {...props}
      className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300"
    />
  </div>
);

const SelectField = ({ label, icon: Icon, options, ...props }: any) => (
  <div className="group">
    <div className="flex items-center mb-1">
      <Icon className="h-4 w-4 text-gray-500 mr-2" />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
    <select
      {...props}
      className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300 appearance-none"
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const AddProgramModal = ({
  isAddModalOpen,
  onCloseAddModal,
  mode = "add",
  programData,
}: ProgramModalsProps) => {
  const [formData, setFormData] = useState<any>({
    course_name: "",
    degree_type: "",
    duration: "",
    tuition_fee: "",
    university_name: "",
    university_location: "",
    start_date: "",
    apply_date: "",
    english_requirments: {
      ielts: 0,
      toefl: 0,
      pte: 0,
    },
    min_gpa: 0,
    work_experience: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && programData) {
      setFormData(programData);
    }
  }, [mode, programData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(mode === "edit" ? "Updating program..." : "Adding program...");

    try {
      const url =
        mode === "edit"
          ? `${getBasePath()}/api/programs?id=${programData?.id}`
          : `${getBasePath()}/api/programs`;

      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${mode} program`);
      }

      const program = await response.json();
      toast.success(
        mode === "edit" ? "Program updated successfully" : "New program added successfully",
        { id: toastId }
      );

      onCloseAddModal(true);
    } catch (error) {
      console.error(`Error ${mode}ing program:`, error);
      toast.error(mode === "edit" ? "Failed to update program" : "Failed to add program", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={() => onCloseAddModal(false)}
      title="Add New Program"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Course Name"
            icon={School}
            type="text"
            placeholder="Enter course name"
            value={formData.course_name}
            onChange={(e: any) => setFormData({ ...formData, course_name: e.target.value })}
          />
          <SelectField
            label="Degree Type"
            icon={GraduationCap}
            value={formData.degree_type}
            onChange={(e: any) => setFormData({ ...formData, degree_type: e.target.value })}
            options={[
              { value: "", label: "Select degree type" },
              { value: "Bachelor's", label: "Bachelor's Degree" },
              { value: "Master's", label: "Master's Degree" },
              { value: "Doctorate", label: "Doctorate" },
            ]}
          />
          <InputField
            label="Duration"
            icon={Calendar}
            type="text"
            placeholder="Enter course duration"
            value={formData.duration}
            onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
          />
          <InputField
            label="Tuition Fee"
            icon={DollarSign}
            type="text"
            placeholder="Enter tuition fee"
            value={formData.tuition_fee}
            onChange={(e: any) => setFormData({ ...formData, tuition_fee: e.target.value })}
          />
          <InputField
            label="University Name"
            icon={Building}
            type="text"
            placeholder="Enter university name"
            value={formData.university_name}
            onChange={(e: any) => setFormData({ ...formData, university_name: e.target.value })}
          />
          <InputField
            label="University Location"
            icon={MapPin}
            type="text"
            placeholder="Enter university location"
            value={formData.university_location}
            onChange={(e: any) => setFormData({ ...formData, university_location: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Intake Date"
            icon={Calendar}
            type="date"
            value={formData.start_date}
            onChange={(e: any) => setFormData({ ...formData, start_date: e.target.value })}
          />
          <InputField
            label="Application Deadline"
            icon={Clock}
            type="date"
            value={formData.apply_date}
            onChange={(e: any) =>
              setFormData({ ...formData, apply_date: e.target.value })
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Languages className="h-4 w-4 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Language Requirements</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="IELTS Score"
              icon={Languages}
              type="number"
              placeholder="Enter IELTS score"
              value={formData?.english_requirments?.ielts}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  english_requirments: {
                    ...formData.english_requirments,
                    ielts: e.target.value,
                  },
                })
              }
            />
            <InputField
              label="TOEFL Score"
              icon={Languages}
              type="number"
              placeholder="Enter TOEFL score"
              value={formData?.english_requirments?.toefl}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  english_requirments: {
                    ...formData.english_requirments,
                    toefl: e.target.value,
                  },
                })
              }
            />
            <InputField
              label="PTE Score"
              icon={Languages}
              type="number"
              placeholder="Enter PTE score"
              value={formData?.english_requirments?.pte}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  english_requirments: {
                    ...formData.english_requirments,
                    pte: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Minimum GPA"
            icon={GraduationCap}
            type="text"
            placeholder="Enter minimum GPA required"
            value={formData?.min_gpa}
            onChange={(e: any) => setFormData({ ...formData, min_gpa: e.target.value })}
          />
          <InputField
            label="Work Experience"
            icon={Briefcase}
            type="text"
            placeholder="Enter required work experience"
            value={formData?.work_experience}
            onChange={(e: any) => setFormData({ ...formData, work_experience: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onCloseAddModal(false)}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#FF4B26] text-white hover:bg-[#E63E1C] transition-colors font-medium shadow-lg shadow-[#FF4B26]/25 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "edit" ? "Updating..." : "Adding..."}
              </div>
            ) : mode === "edit" ? (
              "Update Program"
            ) : (
              "Add Program"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProgramModal;
