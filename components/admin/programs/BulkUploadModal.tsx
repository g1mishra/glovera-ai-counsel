"use client";

import Modal from "@/components/common/Modal";
import { Upload, Loader2, Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { getBasePath } from "@/utils/getBasePath";
import * as XLSX from "xlsx";

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

  const parseExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert sheet to JSON with header row
          const jsonData: any = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            raw: false,
            defval: "",
          });

          // Remove header row and empty rows
          const rows = jsonData.slice(1).filter((row: any) => row.some((cell: any) => cell !== ""));

          // Get headers (convert to lowercase and trim)
          const headers = jsonData[0].map((header: string) => header.toLowerCase().trim());

          // Transform data to match API schema
          const transformedData = rows.map((row: any) => {
            const program: any = {
              course_name: row[headers.indexOf("course_name")] || "",
              degree_type: row[headers.indexOf("degree_type")] || "",
              tuition_fee: row[headers.indexOf("tuition_fee")]?.toString() || "",
              duration: row[headers.indexOf("duration")]?.toString() || "",
              university_name: row[headers.indexOf("university_name")] || "",
              university_location: row[headers.indexOf("university_location")] || "",
              start_date: row[headers.indexOf("start_date")] || "",
              apply_date: row[headers.indexOf("apply_date")] || "",
              english_requirments: {
                ielts: row[headers.indexOf("ielts")] || null,
                toefl: row[headers.indexOf("toefl")] || null,
                pte: row[headers.indexOf("pte")] || null,
              },
              min_gpa: row[headers.indexOf("min_gpa")] || null,
              work_experience: row[headers.indexOf("work_experience")] || null,
            };

            // Add optional fields if they exist
            const programUrlIndex = headers.indexOf("program_url");
            if (programUrlIndex !== -1) {
              program.program_url = row[programUrlIndex] || "";
            }

            return program;
          });

          resolve(transformedData);
        } catch (error) {
          console.error("Error parsing file:", error);
          reject(new Error("Failed to parse file. Please check the file format."));
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    const toastId = toast.loading("Processing file...");
    setIsUploading(true);

    try {
      const programsData = await parseExcelFile(file);
      const formattedData = programsData.map((program) => ({
        course_name: program.course_name,
        degree_type: program.degree_type,
        tuition_fee: program.tuition_fee?.toString(),
        duration: program.duration?.toString(),
        university_name: program.university_name,
        university_location: program.university_location,
        start_date: program.start_date,
        apply_date: program.apply_date,
        english_requirments: {
          ielts: program.ielts?.toString() || "",
          toefl: program.toefl?.toString() || "",
          pte: program.pte?.toString() || "",
        },
        min_gpa: program.min_gpa?.toString() || "",
        work_experience: program.work_experience?.toString() || "",
        global_rank: program.global_rank?.toString() || "",
        program_url: program.program_url || "",
      }));

      const response = await fetch("/api/programs/import/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "";
        let throwErrorMsg = "";

        if (response.status === 409) {
          // Handle duplicate entries
          if (result.duplicates) {
            errorMessage =
              "Duplicate programs found:\n" +
              result.duplicates
                .map(
                  (dup: any) =>
                    `Row ${dup.row}: ${dup.details.course_name} at ${dup.details.university_name} (${dup.details.degree_type})`
                )
                .join("\n");

            throwErrorMsg = `Duplicate programs found : ${result.duplicates.length}`;
          } else {
            errorMessage = result.error || "Duplicate entries detected";
          }
        } else if (result.errors) {
          // Handle validation errors
          errorMessage =
            "Validation errors:\n" +
            result.errors
              .map((err: any) => `Row ${err.row}: ${JSON.stringify(err.error)}`)
              .join("\n");
          throwErrorMsg = `Validation errors found : ${result.errors.length}`;
        } else {
          errorMessage = result.error || "Failed to upload programs";
        }

        console.log("errorMessage", errorMessage);

        throw new Error(throwErrorMsg || errorMessage);
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

  const handleDownloadTemplate = () => {
    // Create template data
    const template = [
      {
        course_name: "Example Course",
        degree_type: "Bachelor's",
        tuition_fee: "10000",
        duration: "4 years",
        university_name: "Example University",
        university_location: "City, Country",
        global_rank: "100",
        program_url: "https://example.com",
        start_date: "2024-09-01",
        apply_date: "2024-08-01",
        ielts: "6.5",
        toefl: "90",
        pte: "60",
        min_gpa: "3.0",
        work_experience: "2 years",
      },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Save file
    XLSX.writeFile(wb, "program_upload_template.xlsx");
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
