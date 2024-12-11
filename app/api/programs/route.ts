import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const degreeType = searchParams.get("degree_type");
    const location = searchParams.get("location");
    const minTuition = searchParams.get("min_tuition");
    const maxTuition = searchParams.get("max_tuition");
    const programId = searchParams.get("programId");
    const budgetRange = searchParams.get("budget_range");

    // Single program fetch
    if (programId) {
      const program = await prisma.programsGloveraFinal.findUnique({
        where: { id: programId },
      });

      if (!program) {
        return Response.json({ error: "Program not found" }, { status: 404 });
      }
      return Response.json(program);
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    // Filters
    const where: any = {
      OR: [
        { program_name: { contains: query, mode: "insensitive" } },
        { university: { contains: query, mode: "insensitive" } },
      ],
    };

    if (degreeType) {
      where.type_of_program = degreeType;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    // Price range filter
    if (minTuition || maxTuition) {
      where.glovera_pricing = {};
      if (minTuition) where.glovera_pricing.gte = parseInt(minTuition);
      if (maxTuition) where.glovera_pricing.lte = parseInt(maxTuition);
    }

    if (budgetRange) {
      const [min, max] = budgetRange.split(" - ").map((val) => {
        return parseInt(val.replace(/[k$]/g, "000").replace(/\D/g, ""));
      });

      where.glovera_pricing = {};  // Initialize the object first

      if (budgetRange.startsWith("Under")) {
        where.glovera_pricing.lte = min;
      } else if (budgetRange.startsWith("Above")) {
        where.glovera_pricing.gte = min;
      } else {
        where.glovera_pricing.gte = min;
        where.glovera_pricing.lte = max;
      }
    }

    const total = await prisma.programsGloveraFinal.count({ where });

    const programs = await prisma.programsGloveraFinal.findMany({
      where,
      orderBy: [{ ranking: "asc" }, { university: "asc" }],
      skip,
      take: limit,
    });

    const responseData = {
      programs: programs || [],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return Response.json(responseData);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return Response.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const program = await prisma.programsGloveraFinal.create({
      data,
    });

    return Response.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return Response.json({ error: "Failed to create program" }, { status: 500 });
  }
}
