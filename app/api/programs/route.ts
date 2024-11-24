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
          orderBy: [
            {
              updatedAt: "desc",
            },
            { id: "asc" },
          ],

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const requiredFields = [
      "course_name",
      "degree_type",
      "tuition_fee",
      "duration",
      "university_name",
      "university_location",
      "intake_date",
      "application_deadline",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return Response.json(
        {
          error: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        course_name: data.course_name,
        degree_type: data.degree_type,
        tuition_fee: data.tuition_fee,
        duration: data.duration,
        university_name: data.university_name,
        university_location: data.university_location,
        intake_date: data.intake_date,
        application_deadline: data.application_deadline,
        english_requirements: data.english_requirements || null,
        min_gpa: data.min_gpa || null,
        work_experience: data.work_experience || null,
        isActive: true,
      },
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

    const data = await request.json();

    const program = await prisma.program.update({
      where: { id },
      data: {
        course_name: data.course_name,
        degree_type: data.degree_type,
        tuition_fee: data.tuition_fee,
        duration: data.duration,
        university_name: data.university_name,
        university_location: data.university_location,
        intake_date: data.intake_date,
        application_deadline: data.application_deadline,
        english_requirements: data.english_requirements || null,
        min_gpa: data.min_gpa || null,
        work_experience: data.work_experience || null,
      },
    });

    return Response.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return Response.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Program ID is required" }, { status: 400 });
    }

    await prisma.program.delete({
      where: { id },
    });

    return Response.json({ message: "Program deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting program:", error);
    return Response.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
