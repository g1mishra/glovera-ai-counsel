"use client";

import Modal from "@/components/common/Modal";
import { Upload, Loader2, Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

type EnglishRequirements = {
  ielts: number | null;
  toefl: number | null;
  pte: number | null;
};

type Program = {
  ranking: number;
  university: string;
  college: string;
  program_name: string;
  location: string;
  glovera_pricing: number;
  original_pricing: number;
  savings_percent: number;
  public_private: string;
  key_job_roles: string;
  iit_or_iim: string;
  location_specialty?: string;
  uni_or_college_specialty?: string;
  possible_specializations_or_concentrations?: string;
  program_top_usp?: string;
  curriculum?: string;
  co_op_internship?: string;
  savings: number;
  total_credits: string;
  credits_in_iit_or_iim: string;
  credits_in_us: string;
  can_finish_in: string;
  ug_background?: string;
  minimum_qualifications?: string;
  design_factor?: string;
  transcript_evaluation?: string;
  LOR?: string;
  SOP?: string;
  interviews?: string;
  application_fee?: string;
  deposit?: number;
  deposit_refundable_if_visa_cancelled?: string;
  co_op?: string;
  key_companies_hiring?: any;
  quant_or_qualitative: string;
  min_gpa?: number;
  gpa_type?: string;
  type_of_program?: string;
  percentage?: number;
  backlog?: number;
  min_work_exp?: number;
  three_year_eleg?: string;
};

export type BulkUploadModalProps = {
  isBulkModalOpen: boolean;
  onCloseBulkModal: () => void;
  onUploadSuccess?: () => void;
};

export const BulkUploadModal = ({
  isBulkModalOpen,
  onCloseBulkModal,
  onUploadSuccess,
}: BulkUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile?.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      droppedFile?.type === "text/csv"
    ) {
      setFile(droppedFile);
    } else {
      toast.error("Please upload an Excel (.xlsx) or CSV file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const parseNumber = (value: any): number | null => {
    if (value === null || value === undefined || value === "") return null;

    // Handle string numbers with decimal points
    if (typeof value === "string") {
      value = value.replace(/,/g, "").trim();
    }

    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  const validateRow = (row: any, headers: string[], rowIndex: number): string[] => {
    const errors: string[] = [];

    // Required fields
    const requiredFields = [
      "ranking",
      "university",
      "college",
      "program_name",
      "location",
      "glovera_pricing",
      "original_pricing",
      "savings_percent",
      "public_private",
      "key_job_roles",
      "iit_or_iim",
      "total_credits",
      "credits_in_iit_or_iim",
      "credits_in_us",
      "can_finish_in",
      "savings",
      "quant_or_qualitative",
    ];

    requiredFields.forEach((field) => {
      const index = headers.indexOf(field);
      if (index === -1 || !row[index]) {
        errors.push(`${field} is required`);
      }
    });

    // Validate numeric fields
    ["glovera_pricing", "original_pricing", "savings", "ranking"].forEach((field) => {
      const index = headers.indexOf(field);
      if (index !== -1) {
        const value = parseNumber(row[index]);
        if (value === null || value < 0) {
          errors.push(`${field} must be a positive number`);
        }
      }
    });

    return errors;
  };

  const parseExcelFile = async (file: File): Promise<Program[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert sheet to JSON with raw: true to get proper date values
          const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

          const transformedData: any[] = jsonData.map((row: any) => {
            // Parse english requirements from JSON string
            let englishReq = {
              ielts: 0,
              toefl: 0,
              pte: 0,
            };

            try {
              if (row.english_requirments) {
                if (typeof row.english_requirments === "string") {
                  const parsedReq = JSON.parse(row.english_requirments);
                  englishReq = {
                    ielts: parsedReq.ielts ? Number(parsedReq.ielts) : 0,
                    toefl: parsedReq.toefl ? Number(parsedReq.toefl) : 0,
                    pte: parsedReq.pte ? Number(parsedReq.pte) : 0,
                  };
                } else if (typeof row.english_requirments === "object") {
                  englishReq = {
                    ielts: row.english_requirments.ielts
                      ? Number(row.english_requirments.ielts)
                      : 0,
                    toefl: row.english_requirments.toefl
                      ? Number(row.english_requirments.toefl)
                      : 0,
                    pte: row.english_requirments.pte ? Number(row.english_requirments.pte) : 0,
                  };
                }
              }
            } catch (error) {
              console.error("Error parsing english requirements:", error);
            }

            // Format dates properly
            const formatDate = (dateValue: any): string => {
              if (!dateValue) return "";

              // If it's a date string, parse it
              if (typeof dateValue === "string") {
                // Check if it's a date in "Month Year" format
                if (dateValue.includes(" ")) {
                  const [month, year] = dateValue.split(" ");
                  return `${month.slice(0, 3)} 1, ${year}`; // Convert to "MMM 1, YYYY"
                }
                return dateValue;
              }

              // If it's an Excel date number, convert it
              if (typeof dateValue === "number") {
                const date = XLSX.SSF.parse_date_code(dateValue);
                return `${date.m}/${date.d}/${date.y}`;
              }

              return dateValue;
            };

            // Remove unnecessary fields and transform the data
            return {
              ranking: Number(row.ranking),
              university: String(row.university || "").trim(),
              college: String(row.college || "").trim(),
              program_name: String(row.program_name || "").trim(),
              location: String(row.location || "").trim(),
              glovera_pricing: Number(row.glovera_pricing),
              original_pricing: Number(row.original_pricing),
              savings_percent: Number(row.savings_percent),
              public_private: String(row.public_private || "").trim(),
              key_job_roles: String(row.key_job_roles || "").trim(),
              iit_or_iim: String(row.iit_or_iim || "").trim(),
              location_specialty: row.location_specialty
                ? String(row.location_specialty).trim()
                : "",
              uni_or_college_specialty: row.uni_or_college_specialty
                ? String(row.uni_or_college_specialty).trim()
                : "",
              possible_specializations_or_concentrations:
                row.possible_specializations_or_concentrations
                  ? String(row.possible_specializations_or_concentrations).trim()
                  : "",
              program_top_usp: row.program_top_usp ? String(row.program_top_usp).trim() : "",
              curriculum: row.curriculum ? String(row.curriculum).trim() : "",
              co_op_internship: row.co_op_internship ? String(row.co_op_internship).trim() : "",
              savings: Number(row.savings),
              total_credits: String(row.total_credits || "").trim(),
              credits_in_iit_or_iim: String(row.credits_in_iit_or_iim || "").trim(),
              credits_in_us: String(row.credits_in_us || "").trim(),
              can_finish_in: String(row.can_finish_in || "").trim(),
              ug_background: row.ug_background ? String(row.ug_background).trim() : "",
              minimum_qualifications: row.minimum_qualifications
                ? String(row.minimum_qualifications).trim()
                : "",
              design_factor: row.design_factor ? String(row.design_factor).trim() : "",
              transcript_evaluation: row.transcript_evaluation
                ? String(row.transcript_evaluation).trim()
                : "",
              LOR: row.LOR ? String(row.LOR).trim() : "",
              SOP: row.SOP ? String(row.SOP).trim() : "",
              interviews: row.interviews ? String(row.interviews).trim() : "",
              application_fee: row.application_fee ? String(row.application_fee).trim() : "",
              deposit: row.deposit ? Number(row.deposit) : 0,
              deposit_refundable_if_visa_cancelled: row.deposit_refundable_if_visa_cancelled
                ? String(row.deposit_refundable_if_visa_cancelled).trim()
                : "",
              co_op: row.co_op ? String(row.co_op).trim() : "",
              key_companies_hiring: row.key_companies_hiring ? row.key_companies_hiring : "",
              quant_or_qualitative: String(row.quant_or_qualitative || "").trim(),
              min_gpa: row.min_gpa ? Number(row.min_gpa) : null,
              gpa_type: row.gpa_type ? String(row.gpa_type).trim() : "",
              type_of_program: row.type_of_program ? String(row.type_of_program).trim() : "",
              percentage: row.percentage ? Number(row.percentage) : null,
              backlog: row.backlog ? Number(row.backlog) : null,
              min_work_exp: row.min_work_exp ? Number(row.min_work_exp) : null,
              three_year_eleg: row.three_year_eleg ? String(row.three_year_eleg).trim() : "",
            };
          });

          resolve(transformedData);
        } catch (error) {
          console.error("Error parsing file:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        ranking: 1,
        university: "Example University",
        college: "Example College",
        program_name: "Master of Business Analytics",
        location: "New York, USA",
        glovera_pricing: 25000,
        original_pricing: 30000,
        savings_percent: 16.67,
        public_private: "Private",
        key_job_roles: "Data Analyst, Business Analyst",
        iit_or_iim: "IIT",
        total_credits: "36",
        credits_in_iit_or_iim: "18",
        credits_in_us: "18",
        can_finish_in: "18 months",
        savings: 5000,
        quant_or_qualitative: "Quant",
        min_gpa: 3.0,
        percentage: 60,
        backlog: 0,
        min_work_exp: 2,
      },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);

    // Set column widths for better visibility
    ws["!cols"] = [
      { wch: 8 }, // ranking
      { wch: 25 }, // university
      { wch: 25 }, // college
      { wch: 30 }, // program_name
      { wch: 20 }, // location
      { wch: 15 }, // glovera_pricing
      { wch: 15 }, // original_pricing
      { wch: 15 }, // savings_percent
      { wch: 15 }, // public_private
      { wch: 30 }, // key_job_roles
      { wch: 10 }, // iit_or_iim
      { wch: 15 }, // total_credits
      { wch: 20 }, // credits_in_iit_or_iim
      { wch: 15 }, // credits_in_us
      { wch: 15 }, // can_finish_in
      { wch: 10 }, // savings
      { wch: 20 }, // quant_or_qualitative
      { wch: 10 }, // min_gpa
      { wch: 10 }, // percentage
      { wch: 10 }, // backlog
      { wch: 15 }, // min_work_exp
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "program_upload_template.xlsx");
  };

  const handleUpload = async () => {
    if (!file) return;

    const toastId = toast.loading("Processing file...");
    setIsUploading(true);

    try {
      const programsData = await parseExcelFile(file);

      if (programsData.length === 0) {
        throw new Error("No valid data found in the file");
      }

      const response = await fetch("/api/programs/import/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programsData),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "Upload failed: ";

        if (response.status === 409) {
          errorMessage += result.details || result.error;
        } else if (result.errors) {
          errorMessage += result.errors
            .map(
              (err: any) =>
                `Row ${err.row}: ${
                  Array.isArray(err.error)
                    ? err.error.map((e: any) => `${e.path}: ${e.message}`).join(", ")
                    : err.error
                }`
            )
            .join("\n");
        } else {
          errorMessage += result.error || "Unknown error occurred";
        }

        throw new Error(errorMessage);
      }

      toast.success(`Successfully imported ${result.imported} programs`, {
        id: toastId,
      });

      setFile(null);
      onCloseBulkModal();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
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
            <label htmlFor="file-upload" className="btn-secondary inline-block cursor-pointer">
              Browse Files
            </label>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Need a template?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Download our Excel template to ensure your data is formatted correctly.
          </p>
          <button
            className="btn-secondary flex items-center gap-2"
            onClick={handleDownloadTemplate}
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button onClick={onCloseBulkModal} className="btn-secondary" disabled={isUploading}>
            Cancel
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Programs
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
