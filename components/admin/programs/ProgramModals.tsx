import React, { useEffect, useState } from "react";
import {
  School,
  Calendar,
  IndianRupee,
  Languages,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  Clock,
  Loader2,
} from "lucide-react";
import Modal from "@/components/common/Modal";
import { getBasePath } from "@/utils/getBasePath";
import toast from "react-hot-toast";
import { ProgramsGloveraFinal } from "@prisma/client";

type ProgramModalsProps = {
  isAddModalOpen: boolean;
  onCloseAddModal: (shouldRefetch?: boolean) => void;
  mode?: "edit" | "add";
  programData?: ProgramsGloveraFinal;
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
    ranking: 0,
    university: "",
    college: "",
    program_name: "",
    location: "",
    glovera_pricing: 0,
    original_pricing: 0,
    savings_percent: 0,
    public_private: "",
    key_job_roles: "",
    iit_or_iim: "",
    location_specialty: "",
    uni_or_college_specialty: "",
    possible_specializations_or_concentrations: "",
    program_top_usp: "",
    curriculum: "",
    co_op_internship: "",
    savings: 0,
    total_credits: "",
    credits_in_iit_or_iim: "",
    credits_in_us: "",
    can_finish_in: "",
    ug_background: "",
    minimum_qualifications: "",
    design_factor: "",
    transcript_evaluation: "",
    LOR: "",
    SOP: "",
    interviews: "",
    application_fee: "",
    deposit: 0,
    deposit_refundable_if_visa_cancelled: "",
    co_op: "",
    key_companies_hiring: {},
    quant_or_qualitative: "",
    min_gpa: 0,
    gpa_type: "",
    type_of_program: "",
    percentage: 0,
    backlog: 0,
    min_work_exp: 0,
    three_year_eleg: "",
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
    if (!formData.program_name?.trim()) newErrors.program_name = "Program name is required";
    if (!formData.university?.trim()) newErrors.university = "University is required";
    if (!formData.college?.trim()) newErrors.college = "College is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.glovera_pricing) newErrors.glovera_pricing = "Glovera pricing is required";
    if (!formData.original_pricing) newErrors.original_pricing = "Original pricing is required";
    if (!formData.ranking) newErrors.ranking = "Ranking is required";

    // Number validations
    if (formData.glovera_pricing && isNaN(Number(formData.glovera_pricing))) {
      newErrors.glovera_pricing = "Must be a valid number";
    }
    if (formData.original_pricing && isNaN(Number(formData.original_pricing))) {
      newErrors.original_pricing = "Must be a valid number";
    }
    if (formData.ranking && isNaN(Number(formData.ranking))) {
      newErrors.ranking = "Must be a valid number";
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
    const toastId = toast.loading(mode === "edit" ? "Updating program..." : "Adding program...");

    try {
      const transformedData = {
        ...formData,
        glovera_pricing: Number(formData.glovera_pricing),
        original_pricing: Number(formData.original_pricing),
        ranking: Number(formData.ranking),
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
      title={mode === "edit" ? "Edit Program" : "Add New Program"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Program Name"
            icon={School}
            type="text"
            placeholder="Enter program name"
            value={formData.program_name}
            onChange={(e: any) => setFormData({ ...formData, program_name: e.target.value })}
            error={errors.program_name}
          />
          <InputField
            label="University"
            icon={Building}
            type="text"
            placeholder="Enter university name"
            value={formData.university}
            onChange={(e: any) => setFormData({ ...formData, university: e.target.value })}
            error={errors.university}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="College"
            icon={Building}
            type="text"
            placeholder="Enter college name"
            value={formData.college}
            onChange={(e: any) => setFormData({ ...formData, college: e.target.value })}
            error={errors.college}
          />
          <InputField
            label="Location"
            icon={MapPin}
            type="text"
            placeholder="Enter location"
            value={formData.location}
            onChange={(e: any) => setFormData({ ...formData, location: e.target.value })}
            error={errors.location}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <InputField
            label="Glovera Pricing"
            icon={IndianRupee}
            type="number"
            placeholder="Enter Glovera pricing"
            value={formData.glovera_pricing}
            onChange={(e: any) =>
              setFormData({ ...formData, glovera_pricing: Number(e.target.value) })
            }
            error={errors.glovera_pricing}
          />
          <InputField
            label="Original Pricing"
            icon={IndianRupee}
            type="number"
            placeholder="Enter original pricing"
            value={formData.original_pricing}
            onChange={(e: any) =>
              setFormData({ ...formData, original_pricing: Number(e.target.value) })
            }
            error={errors.original_pricing}
          />
          <InputField
            label="Ranking"
            icon={GraduationCap}
            type="number"
            placeholder="Enter ranking"
            value={formData.ranking}
            onChange={(e: any) => setFormData({ ...formData, ranking: Number(e.target.value) })}
            error={errors.ranking}
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
