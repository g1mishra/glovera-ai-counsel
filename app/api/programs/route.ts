import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const degreeType = searchParams.get("degree_type");
    const location = searchParams.get("location");
    const duration = searchParams.get("duration");
    const minTuition = searchParams.get("min_tuition");
    const maxTuition = searchParams.get("max_tuition");

    const programId = searchParams.get("programId");

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [{ course_name: { contains: query, mode: "insensitive" } }],
    };

    if (degreeType) {
      where.degree_type = degreeType;
    }

    if (location) {
      where.university_location = { contains: location, mode: "insensitive" };
    }

    if (duration) {
      where.duration = duration;
    }

    if (minTuition && maxTuition) {
      where.tuition_fee = {
        gte: parseInt(minTuition, 10),
        lte: parseInt(maxTuition, 10),
      };
    }

    if (programId) {
      try {
        where.id = programId;
        const program = await prisma.program.findUnique({
          where,
        });

        return new Response(JSON.stringify({ program: program || null }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching program:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch program" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      try {
        const total = await prisma.program.count({ where });

        const programs = await prisma.program.findMany({
          where,
          orderBy: {
            updatedAt: "desc",
          },
          skip,
          take: limit,
        });

        return new Response(
          JSON.stringify({
            programs: programs || [],
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Error fetching programs:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch programs" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch programs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
