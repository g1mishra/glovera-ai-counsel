"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { ProgramFilterParams } from "@/types";

interface FilterOptions {
  degree_types: string[];
  locations: string[];
  budget_ranges: string[];
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProgramFilterParams) => void;
  initialFilters: ProgramFilterParams;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter, initialFilters }) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProgramFilterParams>(initialFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    degree_types: [],
    locations: [],
    budget_ranges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("/api/programs/filters");
        if (!response.ok) throw new Error("Failed to fetch filter options");
        const data = await response.json();
        setFilterOptions(data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </form>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <select
            name="degree_type"
            value={filters.degree_type || ""}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          >
            <option value="">Degree Type</option>
            {filterOptions.degree_types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="budget_range"
            value={filters.budget_range || ""}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          >
            <option value="">Budget Range</option>
            {filterOptions.budget_ranges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={filters.location || ""}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          >
            <option value="">Location</option>
            {filterOptions.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
