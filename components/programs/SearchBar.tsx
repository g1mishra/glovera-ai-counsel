"use client";

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { ProgramFilterParams } from "@/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProgramFilterParams) => void;
  initialFilters?: ProgramFilterParams;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilter,
  initialFilters = {},
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ProgramFilterParams>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (newFilters: Partial<ProgramFilterParams>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
          />
        </form>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-[#FF4B26] flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree Type
              </label>
              <select
                value={filters.degree_type || ""}
                onChange={(e) =>
                  handleFilterChange({ degree_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
              >
                <option value="">All Degrees</option>
                <option value="Bachelor">Bachelor's</option>
                <option value="Master">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                value={filters.duration || ""}
                onChange={(e) =>
                  handleFilterChange({ duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
              >
                <option value="">Any Duration</option>
                <option value="1_year">1 Year</option>
                <option value="2_years">2 Years</option>
                <option value="3_years">3 Years</option>
                <option value="4_years">4 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tuition Range
              </label>
              <select
                value={
                  filters.tuition_range
                    ? `${filters.tuition_range.min}-${filters.tuition_range.max}`
                    : ""
                }
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-").map(Number);
                  handleFilterChange({ tuition_range: { min, max } });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
              >
                <option value="">Any Range</option>
                <option value="0-10000">Under $10,000</option>
                <option value="10000-20000">$10,000 - $20,000</option>
                <option value="20000-30000">$20,000 - $30,000</option>
                <option value="30000-50000">$30,000 - $50,000</option>
                <option value="50000-100000">Over $50,000</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
