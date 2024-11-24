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

const InputField = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="group">
    <div className="flex items-center mb-1">
      <Icon className="h-4 w-4 text-gray-500 mr-2" />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
    <input
      {...props}
      className={`w-full h-11 px-4 rounded-lg border ${
        error ? "border-red-500" : "border-gray-200"
      } bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, icon: Icon, options, error, ...props }: any) => (
  <div className="group">
    <div className="flex items-center mb-1">
      <Icon className="h-4 w-4 text-gray-500 mr-2" />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
    <select
      {...props}
      className={`w-full h-11 px-4 rounded-lg border ${
        error ? "border-red-500" : "border-gray-200"
      } bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300 appearance-none`}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
    tuition_fee_currency: "INR",
    university_name: "",
    university_location: "",
    start_date: "",
    apply_date: "",
    english_requirments: {
      ielts: null,
      toefl: null,
      pte: null,
    },
    min_gpa: null,
    work_experience: null,
    isActive: true,
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && programData) {
      setFormData(programData);
    }
  }, [mode, programData]);

  const validateForm = () => {
    const newErrors: any = {};

    // Required fields
    if (!formData.course_name?.trim())
      newErrors.course_name = "Course name is required";
    if (!formData.degree_type?.trim())
      newErrors.degree_type = "Degree type is required";
    if (!formData.tuition_fee)
      newErrors.tuition_fee = "Tuition fee is required";
    if (!formData.duration?.trim()) newErrors.duration = "Duration is required";
    if (!formData.university_name?.trim())
      newErrors.university_name = "University name is required";
    if (!formData.university_location?.trim())
      newErrors.university_location = "University location is required";
    if (!formData.start_date?.trim())
      newErrors.start_date = "Start date is required";
    if (!formData.apply_date?.trim())
      newErrors.apply_date = "Application deadline is required";

    // Number validations
    if (formData.tuition_fee && isNaN(Number(formData.tuition_fee))) {
      newErrors.tuition_fee = "Must be a valid number";
    }
    if (formData.min_gpa && isNaN(Number(formData.min_gpa))) {
      newErrors.min_gpa = "Must be a valid number";
    }
    if (formData.work_experience && isNaN(Number(formData.work_experience))) {
      newErrors.work_experience = "Must be a valid number";
    }

    // URL validation
    if (formData.program_url && !formData.program_url.match(/^https?:\/\/.+/)) {
      newErrors.program_url = "Must be a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      mode === "edit" ? "Updating program..." : "Adding program..."
    );

    try {
      const transformedData = {
        ...formData,
        tuition_fee: Number(formData.tuition_fee),
        min_gpa: formData.min_gpa ? Number(formData.min_gpa) : null,
        work_experience: formData.work_experience
          ? Number(formData.work_experience)
          : null,
        english_requirments: {
          ielts: formData.english_requirments.ielts
            ? Number(formData.english_requirments.ielts)
            : null,
          toefl: formData.english_requirments.toefl
            ? Number(formData.english_requirments.toefl)
            : null,
          pte: formData.english_requirments.pte
            ? Number(formData.english_requirments.pte)
            : null,
        },
      };

      const url =
        mode === "edit"
          ? `${getBasePath()}/api/programs?id=${programData?.id}`
          : `${getBasePath()}/api/programs`;

      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${mode} program`);
      }

      toast.success(
        mode === "edit"
          ? "Program updated successfully"
          : "New program added successfully",
        { id: toastId }
      );

      onCloseAddModal(true);
    } catch (error) {
      console.error(`Error ${mode}ing program:`, error);
      toast.error(
        mode === "edit" ? "Failed to update program" : "Failed to add program",
        {
          id: toastId,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={() => onCloseAddModal(false)}
      title={mode === "edit" ? "Edit Program" : "Add New Program"}
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
            onChange={(e: any) =>
              setFormData({ ...formData, course_name: e.target.value })
            }
            error={errors.course_name}
          />
          <SelectField
            label="Degree Type"
            icon={GraduationCap}
            value={formData.degree_type}
            onChange={(e: any) =>
              setFormData({ ...formData, degree_type: e.target.value })
            }
            error={errors.degree_type}
            options={[
              { value: "", label: "Select degree type" },
              { value: "Bachelor's", label: "Bachelor's Degree" },
              { value: "Master's", label: "Master's Degree" },
              { value: "Doctorate", label: "Doctorate" },
              { value: "M.B.A.", label: "M.B.A." },
              { value: "M.Sc.", label: "M.Sc." },
              { value: "M.A.", label: "M.A." },
              { value: "LL.M.", label: "LL.M." },
              { value: "M.Eng.", label: "M.Eng." },
              { value: "M.Ed.", label: "M.Ed." },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Duration"
            icon={Calendar}
            type="text"
            placeholder="e.g., 1 year, 2 years"
            value={formData.duration}
            onChange={(e: any) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            error={errors.duration}
          />
          <InputField
            label="Tuition Fee (INR)"
            icon={DollarSign}
            type="number"
            placeholder="Enter tuition fee"
            value={formData.tuition_fee}
            onChange={(e: any) =>
              setFormData({ ...formData, tuition_fee: e.target.value })
            }
            error={errors.tuition_fee}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="University Name"
            icon={Building}
            type="text"
            placeholder="Enter university name"
            value={formData.university_name}
            onChange={(e: any) =>
              setFormData({ ...formData, university_name: e.target.value })
            }
            error={errors.university_name}
          />
          <InputField
            label="University Location"
            icon={MapPin}
            type="text"
            placeholder="e.g., London, United Kingdom"
            value={formData.university_location}
            onChange={(e: any) =>
              setFormData({ ...formData, university_location: e.target.value })
            }
            error={errors.university_location}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Start Date"
            icon={Calendar}
            type="date"
            value={formData.start_date}
            onChange={(e: any) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            error={errors.start_date}
          />
          <InputField
            label="Application Deadline"
            icon={Clock}
            type="date"
            value={formData.apply_date}
            onChange={(e: any) =>
              setFormData({ ...formData, apply_date: e.target.value })
            }
            error={errors.apply_date}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Languages className="h-4 w-4 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">
              Language Requirements
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="IELTS Score"
              icon={Languages}
              type="number"
              step="0.5"
              placeholder="e.g., 6.5"
              value={formData.english_requirments?.ielts}
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
              placeholder="e.g., 90"
              value={formData.english_requirments?.toefl}
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
              placeholder="e.g., 65"
              value={formData.english_requirments?.pte}
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
            type="number"
            step="0.1"
            placeholder="e.g., 3.0"
            value={formData.min_gpa}
            onChange={(e: any) =>
              setFormData({ ...formData, min_gpa: e.target.value })
            }
            error={errors.min_gpa}
          />
          <InputField
            label="Work Experience (Years)"
            icon={Briefcase}
            type="number"
            placeholder="e.g., 2"
            value={formData.work_experience}
            onChange={(e: any) =>
              setFormData({ ...formData, work_experience: e.target.value })
            }
            error={errors.work_experience}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onCloseAddModal(false)}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#FF4B26] text-white hover:bg-[#E63E1C] transition-colors font-medium shadow-lg shadow-[#FF4B26]/25 disabled:opacity-50 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "edit" ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{mode === "edit" ? "Update Program" : "Add Program"}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProgramModal;
