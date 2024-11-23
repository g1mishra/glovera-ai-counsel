"use client";
import { Program, ProgramFilterParams } from "@/types";
import { useState } from "react";
import ProgramList from "./ProgramList";
import SearchBar from "./SearchBar";
import Link from "next/link";

interface ProgramsMainProps {
  programs: Array<Program>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/programs?page=${currentPage - 1}`}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Previous
        </Link>
      )}

      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={`/programs?page=${currentPage + 1}`}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </div>
  );
}

const ProgramsMain = ({ programs: initialPrograms, pagination }: ProgramsMainProps) => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrograms = async (query: string = "", filters: ProgramFilterParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (filters.degree_type) params.append("degree_type", filters.degree_type);
      if (filters.location) params.append("location", filters.location);
      if (filters.duration) params.append("duration", filters.duration);
      if (filters.tuition_range) {
        params.append("min_tuition", filters.tuition_range.min.toString());
        params.append("max_tuition", filters.tuition_range.max.toString());
      }

      const response = await fetch(`/api/programs?${params.toString()}`);
      if (!response.ok) {
        setError("Failed to fetch programs. Please try again.");
        setPrograms([]);
        return;
      }

      const data = await response.json();
      setPrograms(data?.programs || []);
    } catch (err) {
      setError("Failed to load programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    fetchPrograms(query);
  };

  const handleFilter = (filters: ProgramFilterParams) => {
    fetchPrograms("", filters);
  };

  return (
    <div className="space-y-8">
      <SearchBar onSearch={handleSearch} onFilter={handleFilter} initialFilters={{}} />
      <ProgramList programs={programs} loading={loading} error={error} />
      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
};

export default ProgramsMain;
