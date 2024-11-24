import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

type EnglishRequirements = {
  ielts: number; // Required, non-null
  toefl: number; // Required, non-null
  pte: number; // Required, non-null
};

type ProgramInput = {
  course_name: string;
  degree_type: string;
  tuition_fee: number;
  duration: string;
  university_name: string;
  university_location: string;
  start_date: string;
  apply_date: string;
  english_requirments: EnglishRequirements; // Required, non-null
  min_gpa?: number | null;
  work_experience?: number | null;
  global_rank?: string | null;
  program_url?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    let programs: ProgramInput[];
    try {
      const bodyText = await request.text();
      const data = JSON.parse(bodyText);
      programs = Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error("JSON parsing error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON format",
          details:
            error instanceof Error ? error.message : "Unknown parsing error",
        },
        { status: 400 }
      );
    }

    // Validate and transform data
    const transformedPrograms = programs.map((program) => {
      // Ensure english_requirments values are numbers and non-null
      const englishRequirements = {
        ielts: Number(program.english_requirments?.ielts || 0),
        toefl: Number(program.english_requirments?.toefl || 0),
        pte: Number(program.english_requirments?.pte || 0),
      };

      // Validate english requirements
      if (
        isNaN(englishRequirements.ielts) ||
        isNaN(englishRequirements.toefl) ||
        isNaN(englishRequirements.pte)
      ) {
        throw new Error(
          `Invalid english requirements for program: ${program.course_name}`
        );
      }

      return {
        course_name: program.course_name,
        degree_type: program.degree_type,
        tuition_fee: Number(program.tuition_fee),
        tuition_fee_currency: "INR",
        duration: program.duration,
        university_name: program.university_name,
        university_location: program.university_location,
        program_url: program.program_url || null,
        english_requirments: englishRequirements, // Always providing non-null values
        min_gpa: program.min_gpa ? Number(program.min_gpa) : null,
        work_experience: program.work_experience
          ? Number(program.work_experience)
          : null,
        start_date: program.start_date,
        apply_date: program.apply_date,
        isActive: true,
      };
    });

    // Debug log
    console.log(
      "First program data:",
      JSON.stringify(transformedPrograms[0], null, 2)
    );

    // Validate all programs have required fields
    const invalidPrograms = transformedPrograms.filter(
      (program) =>
        !program.english_requirments.ielts ||
        !program.english_requirments.toefl ||
        !program.english_requirments.pte
    );

    if (invalidPrograms.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          details: "All programs must have non-null english requirement scores",
          invalidPrograms: invalidPrograms.map((p) => p.course_name),
        },
        { status: 400 }
      );
    }

    // Create programs one by one
    const created = await Promise.all(
      transformedPrograms.map(async (program) => {
        try {
          return await prisma.program.create({
            data: program,
          });
        } catch (error) {
          console.error("Error creating program:", program.course_name, error);
          throw error; // Re-throw to handle it in the outer catch
        }
      })
    );

    return NextResponse.json({
      success: true,
      imported: created.length,
    });
  } catch (error: any) {
    console.error("Program import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import programs",
        details: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
