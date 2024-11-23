import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== "admin") {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await request.json();

    const validatedPrograms = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const program = ProgramSchema.parse(data[i]);
        validatedPrograms.push(program);
      } catch (error: any) {
        errors.push({ row: i + 1, error: error.errors });
      }
    }

    if (errors.length > 0) {
      return Response.json(
        {
          success: false,
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.program.createMany({
      data: validatedPrograms,
    });

    return Response.json({
      success: true,
      imported: result.count,
    });
  } catch (error) {
    console.error("Program import error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to import programs",
      },
      {
        status: 500,
      }
    );
  }
}
