"use client";

import React, { useState } from "react";
import { Plus, Upload, Download, Search } from "lucide-react";
import { AddProgramModal } from "./ProgramModals";
import { BulkUploadModal } from "./BulkUploadModal";
import SearchBar from "@/components/programs/SearchBar";

const ProgramHeader = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your educational programs and their eligibility criteria
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsBulkModalOpen(true)} className="btn-secondary">
              <Upload className="w-4 h-4" />
              <span>Bulk Upload</span>
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Add Program</span>
            </button>
          </div>
        </div>
      </div>
      <AddProgramModal
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
      />
      <BulkUploadModal
        isBulkModalOpen={isBulkModalOpen}
        onCloseBulkModal={() => setIsBulkModalOpen(false)}
      />
    </>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
}

const StatCard = ({ title, value, trend, trendUp }: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <span
        className={`ml-2 text-xs ${
          trendUp === null ? "text-gray-500" : trendUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend}
      </span>
    </div>
  </div>
);

export default ProgramHeader;
