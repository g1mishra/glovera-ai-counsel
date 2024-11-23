"use client";

import React, { useState } from "react";
import {
  School,
  Calendar,
  DollarSign,
  Languages,
  Trophy,
  GraduationCap,
  Upload,
} from "lucide-react";
import Modal from "@/components/common/Modal";

interface ProgramModalsProps {
  isAddModalOpen: boolean;
  isBulkModalOpen: boolean;
  onCloseAddModal: () => void;
  onCloseBulkModal: () => void;
}

export const AddProgramModal: React.FC<
  Omit<ProgramModalsProps, "isBulkModalOpen" | "onCloseBulkModal">
> = ({ isAddModalOpen, onCloseAddModal }) => {
  const [formData, setFormData] = useState({
    program_name: "",
    degree_type: "",
    duration: "",
    program_start_date: "",
    tuition_fee: "",
    eligibility_criteria: {
      minimum_gpa: "",
      language_proficiency: "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onCloseAddModal();
  };

  const InputField = ({ label, icon: Icon, ...props }: any) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF4B26] transition-colors" />
        </div>
        <input
          {...props}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300"
        />
      </div>
    </div>
  );

  const SelectField = ({ label, icon: Icon, options, ...props }: any) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF4B26] transition-colors" />
        </div>
        <select
          {...props}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 hover:border-gray-300 appearance-none"
        >
          {options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={onCloseAddModal}
      title="Add New Program"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-2">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InputField
            icon={School}
            type="text"
            placeholder="Enter program name"
            value={formData.program_name}
            onChange={(e: any) =>
              setFormData({ ...formData, program_name: e.target.value })
            }
          />
          <SelectField
            icon={GraduationCap}
            value={formData.degree_type}
            onChange={(e: any) =>
              setFormData({ ...formData, degree_type: e.target.value })
            }
            options={[
              { value: "", label: "Select degree type" },
              { value: "Bachelor's", label: "Bachelor's Degree" },
              { value: "Master's", label: "Master's Degree" },
              { value: "Doctorate", label: "Doctorate" },
            ]}
          />
          <InputField
            icon={Calendar}
            type="text"
            placeholder="Enter course duration"
            value={formData.duration}
            onChange={(e: any) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
          <InputField
            icon={DollarSign}
            type="text"
            placeholder="Enter tution fee"
            value={formData.tuition_fee}
            onChange={(e: any) =>
              setFormData({ ...formData, tuition_fee: e.target.value })
            }
          />
          <InputField
            icon={Trophy}
            type="text"
            placeholder="Enter minimum GPA"
            value={formData.eligibility_criteria.minimum_gpa}
            onChange={(e: any) =>
              setFormData({
                ...formData,
                eligibility_criteria: {
                  ...formData.eligibility_criteria,
                  minimum_gpa: e.target.value,
                },
              })
            }
          />
          <InputField
            icon={Languages}
            type="text"
            placeholder="Enter language proficiency, IELTS, TOEFL, etc."
            value={formData.eligibility_criteria.language_proficiency}
            onChange={(e: any) =>
              setFormData({
                ...formData,
                eligibility_criteria: {
                  ...formData.eligibility_criteria,
                  language_proficiency: e.target.value,
                },
              })
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-8 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCloseAddModal}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#FF4B26] text-white hover:bg-[#E63E1C] transition-colors font-medium shadow-lg shadow-[#FF4B26]/25"
          >
            Add Program
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const BulkUploadModal: React.FC<
  Omit<ProgramModalsProps, "isAddModalOpen" | "onCloseAddModal">
> = ({ isBulkModalOpen, onCloseBulkModal }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile?.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      droppedFile?.type === "text/csv"
    ) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Modal
      isOpen={isBulkModalOpen}
      onClose={onCloseBulkModal}
      title="Bulk Upload Programs"
      size="md"
    >
      <div className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-[#FF4B26] bg-[#FFF5F3]" : "border-gray-300"
          }`}
          onDragOver={(e: any) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />

          <div className="space-y-2">
            <p className="text-gray-600">
              {file
                ? `Selected file: ${file.name}`
                : "Drop your Excel or CSV file here, or click to browse"}
            </p>
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-secondary inline-block cursor-pointer"
            >
              Browse Files
            </label>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Need a template?
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Download our Excel template to ensure your data is formatted
            correctly.
          </p>
          <button className="btn-secondary">Download Template</button>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button onClick={onCloseBulkModal} className="btn-secondary">
            Cancel
          </button>
          <button className="btn-primary" disabled={!file}>
            Upload Programs
          </button>
        </div>
      </div>
    </Modal>
  );
};
