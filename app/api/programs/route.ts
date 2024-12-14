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
        { college: { contains: query, mode: "insensitive" } },
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

      where.glovera_pricing = {}; // Initialize the object first

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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Program ID is required" }, { status: 400 });
    }

    // Check if program exists
    const existingProgram = await prisma.programsGloveraFinal.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProgram) {
      return Response.json({ error: "Program not found" }, { status: 404 });
    }

    const rawData = await request.json();

    // Transform the data to match schema types
    const data = {
      ...rawData,
      ranking: rawData.ranking ? parseInt(rawData.ranking) : undefined,
      glovera_pricing: rawData.glovera_pricing ? parseInt(rawData.glovera_pricing) : undefined,
      original_pricing: rawData.original_pricing ? parseInt(rawData.original_pricing) : undefined,
      savings_percent: rawData.savings_percent ? parseFloat(rawData.savings_percent) : undefined,
      savings: rawData.savings ? parseInt(rawData.savings) : undefined,
      deposit: rawData.deposit ? parseInt(rawData.deposit) : undefined,
      min_gpa: rawData.min_gpa ? parseInt(rawData.min_gpa) : undefined,
      percentage: rawData.percentage ? parseInt(rawData.percentage) : undefined,
      backlog: rawData.backlog ? parseInt(rawData.backlog) : undefined,
      min_work_exp: rawData.min_work_exp ? parseInt(rawData.min_work_exp) : undefined,
      // Handle key_companies_hiring if it's a string
      key_companies_hiring: rawData.key_companies_hiring ? rawData.key_companies_hiring : "",
    };

    // Remove undefined values to prevent null updates
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    delete data.id;
    // Update program
    const updatedProgram = await prisma.programsGloveraFinal.update({
      where: { id },
      data,
    });

    return Response.json(updatedProgram);
  } catch (error) {
    console.error("Error updating program:", error);

    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return Response.json({ error: "Program not found" }, { status: 404 });
      }
      if (error.message.includes("Invalid ObjectId")) {
        return Response.json({ error: "Invalid program ID format" }, { status: 400 });
      }
      // Log the actual error message for debugging
      console.error("Detailed error:", error.message);
    }

    return Response.json(
      { error: "Failed to update program. Please check data types." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Program ID is required" }, { status: 400 });
    }

    await prisma.programsGloveraFinal.delete({
      where: { id },
    });

    return Response.json({ message: "Program deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting program:", error);
    return Response.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
