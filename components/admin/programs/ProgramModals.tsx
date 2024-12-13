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
  BookOpen,
  FileText,
  Users,
  Building2,
  Percent,
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

const TextAreaField = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="group">
    <div className="flex items-center mb-1">
      <Icon className="h-4 w-4 text-gray-500 mr-2" />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
    <textarea
      {...props}
      className={`w-full p-4 rounded-lg border ${
        error ? "border-red-500" : "border-gray-200"
      } bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300 min-h-[100px]`}
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
    key_companies_hiring: "",
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

    // Required fields validation
    const requiredFields = [
      "program_name",
      "university",
      "college",
      "location",
      "glovera_pricing",
      "original_pricing",
      "ranking",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    // Numeric validations
    const numericFields = [
      "glovera_pricing",
      "original_pricing",
      "ranking",
      "savings_percent",
      "savings",
      "deposit",
      "min_gpa",
      "percentage",
      "backlog",
      "min_work_exp",
    ];

    numericFields.forEach((field) => {
      if (formData[field] && isNaN(Number(formData[field]))) {
        newErrors[field] = "Must be a valid number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   toast.error("Please fix the errors in the form");
    //   return;
    // }

    setIsSubmitting(true);
    const toastId = toast.loading(
      mode === "edit" ? "Updating program..." : "Adding program..."
    );

    try {
      const transformedData = {
        ...formData,
        glovera_pricing: Number(formData.glovera_pricing),
        original_pricing: Number(formData.original_pricing),
        ranking: Number(formData.ranking),
        savings_percent: Number(formData.savings_percent),
        savings: Number(formData.savings),
        deposit: Number(formData.deposit),
        min_gpa: Number(formData.min_gpa),
        percentage: Number(formData.percentage),
        backlog: Number(formData.backlog),
        min_work_exp: Number(formData.min_work_exp),
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
        { id: toastId }
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
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">Basic Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Program Name"
              icon={School}
              type="text"
              value={formData.program_name}
              onChange={(e: any) =>
                setFormData({ ...formData, program_name: e.target.value })
              }
              error={errors.program_name}
            />
            <InputField
              label="University"
              icon={Building}
              type="text"
              value={formData.university}
              onChange={(e: any) =>
                setFormData({ ...formData, university: e.target.value })
              }
              error={errors.university}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="College"
              icon={Building2}
              type="text"
              value={formData.college}
              onChange={(e: any) =>
                setFormData({ ...formData, college: e.target.value })
              }
              error={errors.college}
            />
            <InputField
              label="Location"
              icon={MapPin}
              type="text"
              value={formData.location}
              onChange={(e: any) =>
                setFormData({ ...formData, location: e.target.value })
              }
              error={errors.location}
            />
          </div>
        </div>

        {/* Pricing Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">Pricing Information</h3>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Glovera Pricing"
              icon={DollarSign}
              type="number"
              value={formData.glovera_pricing}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  glovera_pricing: Number(e.target.value),
                })
              }
              error={errors.glovera_pricing}
            />
            <InputField
              label="Original Pricing"
              icon={DollarSign}
              type="number"
              value={formData.original_pricing}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  original_pricing: Number(e.target.value),
                })
              }
              error={errors.original_pricing}
            />
            <InputField
              label="Savings"
              icon={DollarSign}
              type="number"
              value={formData.savings}
              onChange={(e: any) =>
                setFormData({ ...formData, savings: Number(e.target.value) })
              }
              error={errors.savings}
            />
          </div>
        </div>

        {/* Program Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">Program Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <TextAreaField
              label="Program USP"
              icon={BookOpen}
              value={formData.program_top_usp}
              onChange={(e: any) =>
                setFormData({ ...formData, program_top_usp: e.target.value })
              }
            />
            <TextAreaField
              label="Key Job Roles"
              icon={Briefcase}
              value={formData.key_job_roles}
              onChange={(e: any) =>
                setFormData({ ...formData, key_job_roles: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TextAreaField
              label="Curriculum"
              icon={BookOpen}
              value={formData.curriculum}
              onChange={(e: any) =>
                setFormData({ ...formData, curriculum: e.target.value })
              }
            />
            <TextAreaField
              label="Possible Specializations"
              icon={BookOpen}
              value={formData.possible_specializations_or_concentrations}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  possible_specializations_or_concentrations: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">Requirements</h3>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Minimum GPA"
              icon={GraduationCap}
              type="number"
              value={formData.min_gpa}
              onChange={(e: any) =>
                setFormData({ ...formData, min_gpa: Number(e.target.value) })
              }
            />
            <InputField
              label="GPA Type"
              icon={GraduationCap}
              type="text"
              value={formData.gpa_type}
              onChange={(e: any) =>
                setFormData({ ...formData, gpa_type: e.target.value })
              }
            />
            <InputField
              label="Minimum Work Experience"
              icon={Briefcase}
              type="number"
              value={formData.min_work_exp}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  min_work_exp: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Application Requirements */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">
            Application Requirements
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Transcript Evaluation"
              icon={FileText}
              type="text"
              value={formData.transcript_evaluation}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  transcript_evaluation: e.target.value,
                })
              }
            />
            <InputField
              label="LOR"
              icon={FileText}
              type="text"
              value={formData.LOR}
              onChange={(e: any) =>
                setFormData({ ...formData, LOR: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="SOP"
              icon={FileText}
              type="text"
              value={formData.SOP}
              onChange={(e: any) =>
                setFormData({ ...formData, SOP: e.target.value })
              }
            />
            <InputField
              label="Interviews"
              icon={Users}
              type="text"
              value={formData.interviews}
              onChange={(e: any) =>
                setFormData({ ...formData, interviews: e.target.value })
              }
            />
          </div>
        </div>

        {/* Credits and Duration */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">
            Credits and Duration
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Total Credits"
              icon={BookOpen}
              type="text"
              value={formData.total_credits}
              onChange={(e: any) =>
                setFormData({ ...formData, total_credits: e.target.value })
              }
            />
            <InputField
              label="Credits in IIT/IIM"
              icon={BookOpen}
              type="text"
              value={formData.credits_in_iit_or_iim}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  credits_in_iit_or_iim: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Credits in US"
              icon={BookOpen}
              type="text"
              value={formData.credits_in_us}
              onChange={(e: any) =>
                setFormData({ ...formData, credits_in_us: e.target.value })
              }
            />
            <InputField
              label="Can Finish In"
              icon={Clock}
              type="text"
              value={formData.can_finish_in}
              onChange={(e: any) =>
                setFormData({ ...formData, can_finish_in: e.target.value })
              }
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">
            Additional Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Public/Private"
              icon={Building}
              type="text"
              value={formData.public_private}
              onChange={(e: any) =>
                setFormData({ ...formData, public_private: e.target.value })
              }
            />
            <InputField
              label="IIT or IIM"
              icon={School}
              type="text"
              value={formData.iit_or_iim}
              onChange={(e: any) =>
                setFormData({ ...formData, iit_or_iim: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Location Specialty"
              icon={MapPin}
              type="text"
              value={formData.location_specialty}
              onChange={(e: any) =>
                setFormData({ ...formData, location_specialty: e.target.value })
              }
            />
            <InputField
              label="University/College Specialty"
              icon={Building}
              type="text"
              value={formData.uni_or_college_specialty}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  uni_or_college_specialty: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Fees and Deposits */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">Fees and Deposits</h3>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Application Fee"
              icon={DollarSign}
              type="text"
              value={formData.application_fee}
              onChange={(e: any) =>
                setFormData({ ...formData, application_fee: e.target.value })
              }
            />
            <InputField
              label="Deposit"
              icon={DollarSign}
              type="number"
              value={formData.deposit}
              onChange={(e: any) =>
                setFormData({ ...formData, deposit: Number(e.target.value) })
              }
            />
            <InputField
              label="Deposit Refundable if Visa Cancelled"
              icon={DollarSign}
              type="text"
              value={formData.deposit_refundable_if_visa_cancelled}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  deposit_refundable_if_visa_cancelled: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Program Type and Requirements */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-left">
            Program Type and Requirements
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Type of Program"
              icon={BookOpen}
              type="text"
              value={formData.type_of_program}
              onChange={(e: any) =>
                setFormData({ ...formData, type_of_program: e.target.value })
              }
            />
            <InputField
              label="Quant/Qualitative"
              icon={BookOpen}
              type="text"
              value={formData.quant_or_qualitative}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  quant_or_qualitative: e.target.value,
                })
              }
            />
            <InputField
              label="Three Year Eligibility"
              icon={Calendar}
              type="text"
              value={formData.three_year_eleg}
              onChange={(e: any) =>
                setFormData({ ...formData, three_year_eleg: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <InputField
              label="Percentage"
              icon={Percent}
              type="number"
              value={formData.percentage}
              onChange={(e: any) =>
                setFormData({ ...formData, percentage: Number(e.target.value) })
              }
            />
            <InputField
              label="Backlog"
              icon={Clock}
              type="number"
              value={formData.backlog}
              onChange={(e: any) =>
                setFormData({ ...formData, backlog: Number(e.target.value) })
              }
            />
            <InputField
              label="Design Factor"
              icon={BookOpen}
              type="text"
              value={formData.design_factor}
              onChange={(e: any) =>
                setFormData({ ...formData, design_factor: e.target.value })
              }
            />
          </div>
        </div>

        {/* Submit Buttons */}
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
