"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import ProgramList from "@/components/admin/programs/ProgramList";
import ProgramHeader from "@/components/admin/programs/ProgramHeader";

export const metadata: Metadata = {
  title: "Program Management | Admin Dashboard",
  description: "Manage university programs and eligibility criteria",
};

export default function ProgramManagement() {
  const [programs, setPrograms] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrograms = async (
    query: string = "",
    filters: ProgramFilterParams = {}
  ) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (filters.degree_type)
        params.append("degree_type", filters.degree_type);
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
    <div className="space-y-6">
      <ProgramHeader />
      <SearchBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialFilters={{}}
      />
      <ProgramList />
    </div>
  );
}
