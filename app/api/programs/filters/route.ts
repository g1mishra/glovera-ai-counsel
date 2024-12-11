import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.programsGloveraFinal.findMany({
      select: {
        type_of_program: true,
        location: true,
        glovera_pricing: true,
      },
      distinct: ["type_of_program", "location"],
    });

    // Create budget ranges based on program prices
    const prices = programs.map((p) => p.glovera_pricing).filter(Boolean);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const budget_ranges = [
      `Under ${Math.floor(minPrice / 1000)}k`,
      `${Math.floor(minPrice / 1000)}k - ${Math.floor(maxPrice / 2000)}k`,
      `${Math.floor(maxPrice / 2000)}k - ${Math.floor(maxPrice / 1000)}k`,
      `Above ${Math.floor(maxPrice / 1000)}k`,
    ];

    return Response.json({
      degree_types: [...new Set(programs.map((p) => p.type_of_program))].filter(Boolean),
      locations: [...new Set(programs.map((p) => p.location))].filter(Boolean),
      budget_ranges,
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return Response.json({ error: "Failed to fetch filter options" }, { status: 500 });
  }
}
