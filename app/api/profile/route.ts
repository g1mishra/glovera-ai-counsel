import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/authOptions";

const ProfileSchema = z.object({
  undergraduate_degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University is required"),
  gpa: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 4;
  }, "GPA must be between 0 and 4"),

  language_proficiency: z.object({
    test_type: z.string().min(1, "Test type is required"),
    overall_score: z.string().min(1, "Score is required"),
  }),

  work_experience_years: z.string(),
  technical_skills: z.array(z.string()).min(1, "Select at least one skill"),
  preferred_study_countries: z.array(z.string()).min(1, "Select at least one country"),
  target_intake: z.string().min(1, "Target intake is required"),
  budget_range: z.string().min(1, "Budget range is required"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = ProfileSchema.parse(data);

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: validatedData,
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          ...validatedData,
          userId: session.user.id,
        },
      });
    }

    return Response.json({
      success: true,
      data: profile,
    });
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
      where: { userId: session.user.id },
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
