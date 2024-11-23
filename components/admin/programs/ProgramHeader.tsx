"use client";

import React, { useState } from "react";
import { Plus, Upload, Download, Search } from "lucide-react";
import { AddProgramModal, BulkUploadModal } from "./ProgramModals";

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
            <button
              onClick={() => {
                /* Handle export */
              }}
              className="btn-secondary"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="btn-secondary"
            >
              <Upload className="w-4 h-4" />
              <span>Bulk Upload</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add Program</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Total Programs"
            value="128"
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Active Programs"
            value="98"
            trend="+5% from last month"
            trendUp={true}
          />
          <StatCard
            title="Universities"
            value="45"
            trend="Same as last month"
            trendUp={null}
          />
          <StatCard
            title="Applications"
            value="1,234"
            trend="-3% from last month"
            trendUp={false}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search programs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent"
            />
          </div>
          <select className="filter-select">
            <option>All Degree Types</option>
            <option>Bachelor's</option>
            <option>Master's</option>
            <option>PhD</option>
          </select>
          <select className="filter-select">
            <option>All Universities</option>
          </select>
          <select className="filter-select">
            <option>All Locations</option>
          </select>
          <select className="filter-select">
            <option>Status: All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
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
          trendUp === null
            ? "text-gray-500"
            : trendUp
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {trend}
      </span>
    </div>
  </div>
);

export default ProgramHeader;
