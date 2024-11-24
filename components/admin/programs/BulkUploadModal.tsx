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
  course_name: string;
  degree_type: string;
  tuition_fee: number;
  duration: string;
  university_name: string;
  university_location: string;
  global_rank?: string | null;
  program_url?: string | null;
  start_date: string;
  apply_date: string;
  english_requirments: EnglishRequirements | null;
  min_gpa?: number | null;
  work_experience?: number | null;
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
      droppedFile?.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
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

  const validateRow = (
    row: any,
    headers: string[],
    rowIndex: number
  ): string[] => {
    const errors: string[] = [];

    // Required fields
    const requiredFields = [
      "course_name",
      "degree_type",
      "tuition_fee",
      "duration",
      "university_name",
      "university_location",
      "start_date",
      "apply_date",
    ];

    requiredFields.forEach((field) => {
      const index = headers.indexOf(field);
      if (index === -1 || !row[index]) {
        errors.push(`${field} is required`);
      }
    });

    // Validate tuition fee
    const tuitionIndex = headers.indexOf("tuition_fee");
    if (tuitionIndex !== -1) {
      const fee = parseNumber(row[tuitionIndex]);
      if (fee === null || fee <= 0) {
        errors.push("tuition_fee must be a positive number");
      }
    }

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

          const transformedData: Program[] = jsonData.map((row: any) => {
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
                    pte: row.english_requirments.pte
                      ? Number(row.english_requirments.pte)
                      : 0,
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
              course_name: String(row.course_name || "").trim(),
              degree_type: String(row.degree_type || "").trim(),
              tuition_fee: Number(row.tuition_fee),
              duration: String(row.duration || "").trim(),
              university_name: String(row.university_name || "").trim(),
              university_location: String(row.university_location || "").trim(),
              start_date: formatDate(row.start_date),
              apply_date: formatDate(row.apply_date),
              english_requirments: englishReq,
              min_gpa: row.min_gpa ? Number(row.min_gpa) : null,
              work_experience: row.work_experience
                ? Number(row.work_experience)
                : 0,
              global_rank: row.global_rank
                ? String(Number(row.global_rank) * 100).replace(/[^0-9.]/g, "")
                : null,
              program_url: row.program_url
                ? String(row.program_url).trim()
                : null,
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

  // Also update the template data to match the expected format
  const handleDownloadTemplate = () => {
    const template = [
      {
        course_name: "Master of Business Analytics",
        degree_type: "M.Sc. / Full-time / On Campus",
        tuition_fee: 25000,
        duration: "2 years",
        university_name: "Example University",
        university_location: "London, UK",
        global_rank: "50",
        program_url: "https://example.com/program",
        start_date: "09/01/2024",
        apply_date: "03/01/2024",
        ielts: 6.5,
        toefl: 90,
        pte: 60,
        min_gpa: 3.0,
        work_experience: 2,
      },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);

    // Set column widths for better visibility
    ws["!cols"] = [
      { wch: 30 }, // course_name
      { wch: 25 }, // degree_type
      { wch: 12 }, // tuition_fee
      { wch: 10 }, // duration
      { wch: 25 }, // university_name
      { wch: 25 }, // university_location
      { wch: 12 }, // global_rank
      { wch: 40 }, // program_url
      { wch: 12 }, // start_date
      { wch: 12 }, // apply_date
      { wch: 8 }, // ielts
      { wch: 8 }, // toefl
      { wch: 8 }, // pte
      { wch: 8 }, // min_gpa
      { wch: 15 }, // work_experience
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
                    ? err.error
                        .map((e: any) => `${e.path}: ${e.message}`)
                        .join(", ")
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
          <button
            className="btn-secondary flex items-center gap-2"
            onClick={handleDownloadTemplate}
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCloseBulkModal}
            className="btn-secondary"
            disabled={isUploading}
          >
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
