import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const ProgramSchema = z.object({
  course_name: z.string().min(1),
  degree_type: z.string().min(1),
  tuition_fee: z.string().min(1),
  duration: z.string().min(1),
  university_name: z.string().min(1),
  university_location: z.string().min(1),
  global_rank: z.string().optional(),
  program_url: z.string().url().optional(),
  intake_date: z.string().min(1),
  application_deadline: z.string().min(1),
  english_requirements: z
    .object({
      ielts: z.string().optional(),
      toefl: z.string().optional(),
      pte: z.string().optional(),
    })
    .optional(),
  min_gpa: z.string().optional(),
  work_experience: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input: expected an array of programs",
        },
        { status: 400 }
      );
    }

    // First pass: Validate schema and check for duplicates within the upload
    const validatedPrograms = [];
    const errors = [];
    const seenPrograms = new Set();

    for (let i = 0; i < data.length; i++) {
      try {
        const program = ProgramSchema.parse(data[i]);

        // Create a unique key for the program
        const programKey = `${program.course_name}-${program.university_name}-${program.degree_type}`;

        if (seenPrograms.has(programKey)) {
          errors.push({
            row: i + 1,
            error: "Duplicate program within the upload",
            details: {
              course_name: program.course_name,
              university_name: program.university_name,
              degree_type: program.degree_type,
            },
          });
          continue;
        }

        seenPrograms.add(programKey);
        validatedPrograms.push(program);
      } catch (error: any) {
        errors.push({
          row: i + 1,
          error: error.errors || error.message,
        });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 }
      );
    }

    // Optimized database check for duplicates using a single query
    const existingPrograms = await prisma.program.findMany({
      where: {
        OR: validatedPrograms.map((program) => ({
          AND: [
            { course_name: program.course_name },
            { university_name: program.university_name },
            { degree_type: program.degree_type },
          ],
        })),
      },
      select: {
        course_name: true,
        university_name: true,
        degree_type: true,
      },
    });

    // Create a Set of existing program keys for O(1) lookup
    const existingProgramKeys = new Set(
      existingPrograms.map(
        (prog) =>
          `${prog.course_name}-${prog.university_name}-${prog.degree_type}`
      )
    );

    // Check for duplicates
    const duplicates = validatedPrograms
      .map((program, index) => {
        const key = `${program.course_name}-${program.university_name}-${program.degree_type}`;
        if (existingProgramKeys.has(key)) {
          return {
            row: index + 1,
            error: "Program already exists in database",
            details: {
              course_name: program.course_name,
              university_name: program.university_name,
              degree_type: program.degree_type,
            },
          };
        }
        return null;
      })
      .filter(Boolean);

    if (duplicates.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate programs found",
          duplicates,
        },
        { status: 409 }
      );
    }

    // If no duplicates, proceed with insertion
    try {
      const result = await prisma.program.createMany({
        data: validatedPrograms.map((program) => ({
          ...program,
          english_requirements: program.english_requirements || null,
        })),
      });

      return NextResponse.json({
        success: true,
        imported: result.count,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return NextResponse.json(
            {
              success: false,
              error: "Duplicate entries detected",
              details: "Some programs already exist in the database",
            },
            { status: 409 }
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("Program import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import programs",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
