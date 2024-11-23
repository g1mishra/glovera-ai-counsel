import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [degreeTypes, locations, durations] = await Promise.all([
      prisma.program.findMany({
        select: { degree_type: true },
        distinct: ["degree_type"],
      }),
      prisma.program.findMany({
        select: { university_location: true },
        distinct: ["university_location"],
      }),
      prisma.program.findMany({
        select: { duration: true },
        distinct: ["duration"],
      }),
    ]);

    return Response.json({
      degree_types: degreeTypes.map((d) => d.degree_type).filter(Boolean),
      locations: locations.map((l) => l.university_location).filter(Boolean),
      durations: durations
        .map((d) => d.duration)
        .filter(Boolean)
        .sort((a, b) => Number(a) - Number(b)),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return Response.json({ error: "Failed to fetch filter options" }, { status: 500 });
  }
}
