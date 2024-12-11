import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/authOptions";
import { Prisma } from "@prisma/client";

const ProfileSchema = z.object({
  undergraduate_degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University is required"),
  gpa: z.number().min(0).max(4).nullable(),
  percentage: z.number().min(0).max(100).nullable(),
  backlogs: z.number().min(0),
  naac_grade: z.string().nullable(),
  program_type: z.string().min(1, "Program type is required"),
  language_proficiency: z.object({
    test_type: z.string().min(1, "Test type is required"),
    overall_score: z.number().min(0, "Score is required"),
  }),
  work_experience_years: z.number().min(0).nullable(),
  technical_skills: z.array(z.string()).optional(),
  preferred_study_countries: z.array(z.string()).min(1, "Select at least one country"),
  target_intake: z.string().min(1, "Target intake is required"),
  budget_range: z.string().min(1, "Budget range is required"),
  eligible_programs: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const validatedData = ProfileSchema.parse({
      ...data,
      gpa: data.gpa ? parseFloat(data.gpa) : null,
      percentage: data.percentage ? parseFloat(data.percentage) : null,
      backlogs: parseInt(data.backlogs),
      work_experience_years: data.work_experience_years
        ? parseInt(data.work_experience_years)
        : null,
      language_proficiency: {
        ...data.language_proficiency,
        overall_score: parseFloat(data.language_proficiency.overall_score),
      },
    });

    // Explicitly check if ID is valid MongoDB ObjectId
    if (!session.user.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("Invalid ObjectId format");
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      select: { id: true }, // Only select ID first to verify query works
    });

    const profileData = {
      ...validatedData,
      language_proficiency: {
        test_type: validatedData.language_proficiency.test_type,
        overall_score: validatedData.language_proficiency.overall_score,
      },
    };

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: profileData,
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          ...profileData,
          userId: session.user.id,
        },
      });
    }

    return Response.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return Response.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch profile",
      },
      {
        status: 500,
      }
    );
  }
}
