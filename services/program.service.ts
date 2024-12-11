"use server";

import { getBasePath } from "@/utils/getBasePath";
import { ProgramsGloveraFinal } from "@prisma/client";

export interface ProgramsResponse {
  programs: ProgramsGloveraFinal[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getPrograms(page: number = 1, limit: number = 9) {
  try {
    const path = `${getBasePath()}/api/programs?page=${page}&limit=${limit}`;

    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      console.error("Failed to fetch programs:", response.statusText);
      return {
        programs: [],
        pagination: { total: 0, page: 1, limit: 9, totalPages: 0 },
      };
    }

    const data: ProgramsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return {
      programs: [],
      pagination: { total: 0, page: 1, limit: 9, totalPages: 0 },
    };
  }
}
