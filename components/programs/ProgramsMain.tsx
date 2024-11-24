"use client";

import { ProgramFilterParams, ProgramsMainProps } from "@/types";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import ProgramList from "./ProgramList";
import SearchBar from "./SearchBar";

const ProgramsMain = ({ programs: initialPrograms, pagination }: ProgramsMainProps) => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPrograms(initialPrograms);
  }, [initialPrograms]);

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

      const response = await fetch(`/api/programs?${params.toString()}`, {
        cache: "no-store",
      });
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
      <Pagination
        path="/programs"
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />
    </div>
  );
};

export default ProgramsMain;
