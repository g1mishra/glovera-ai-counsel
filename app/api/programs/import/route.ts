import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

type ProgramInput = {
  ranking: number;
  university: string;
  college: string;
  program_name: string;
  location: string;
  glovera_pricing: number;
  original_pricing: number;
  savings_percent: number;
  public_private: string;
  key_job_roles: string;
  iit_or_iim: string;
  location_specialty?: string;
  uni_or_college_specialty?: string;
  possible_specializations_or_concentrations?: string;
  program_top_usp?: string;
  curriculum?: string;
  co_op_internship?: string;
  savings: number;
  total_credits: string;
  credits_in_iit_or_iim: string;
  credits_in_us: string;
  can_finish_in: string;
  ug_background?: string;
  minimum_qualifications?: string;
  design_factor?: string;
  transcript_evaluation?: string;
  LOR?: string;
  SOP?: string;
  interviews?: string;
  application_fee?: string;
  deposit?: number;
  deposit_refundable_if_visa_cancelled?: string;
  co_op?: string;
  key_companies_hiring?: any;
  quant_or_qualitative: string;
  min_gpa?: number;
  gpa_type?: string;
  type_of_program?: string;
  percentage?: number;
  backlog?: number;
  min_work_exp?: number;
  three_year_eleg?: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse input data
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
          details: error instanceof Error ? error.message : "Unknown parsing error",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const invalidPrograms = programs.filter(
      (p) => !p.program_name || !p.university || !p.glovera_pricing || !p.original_pricing
    );

    if (invalidPrograms.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: invalidPrograms.map((p) => p.program_name || "Unnamed program"),
        },
        { status: 400 }
      );
    }

    // Transform the data
    const transformedPrograms = programs.map((program) => {
      const gloveraPrice = Number(program.glovera_pricing) || 0;
      const originalPrice = Number(program.original_pricing) || 0;
      const savings = originalPrice - gloveraPrice;
      const savingsPercent = ((savings / originalPrice) * 100).toFixed(2);

      return {
        ranking: Number(program.ranking) || 0,
        university: String(program.university),
        college: String(program.college),
        program_name: String(program.program_name),
        location: String(program.location),
        public_private: String(program.public_private),
        location_specialty: program.location_specialty ?? null,
        uni_or_college_specialty: program.uni_or_college_specialty ?? null,
        possible_specializations_or_concentrations:
          program.possible_specializations_or_concentrations ?? null,
        program_top_usp: program.program_top_usp ?? null,
        curriculum: program.curriculum ?? null,
        co_op_internship: program.co_op_internship ?? null,
        glovera_pricing: gloveraPrice,
        original_pricing: originalPrice,
        savings: savings,
        savings_percent: parseFloat(savingsPercent) || 0,
        total_credits: program.total_credits ?? null,
        iit_or_iim: program.iit_or_iim ?? null,
        credits_in_iit_or_iim: program.credits_in_iit_or_iim ?? null,
        credits_in_us: program.credits_in_us ?? null,
        can_finish_in: program.can_finish_in ?? null,
        ug_background: program.ug_background ?? null,
        minimum_qualifications: program.minimum_qualifications ?? null,
        design_factor: program.design_factor ?? null,
        transcript_evaluation: program.transcript_evaluation ?? null,
        LOR: program.LOR ?? null,
        SOP: program.SOP ?? null,
        interviews: program.interviews ?? null,
        application_fee: program.application_fee ?? null,
        deposit: Number(program.deposit) || 0,
        deposit_refundable_if_visa_cancelled: program.deposit_refundable_if_visa_cancelled ?? null,
        co_op: program.co_op ?? null,
        key_companies_hiring:
          typeof program.key_companies_hiring === "string" ? program.key_companies_hiring : "",
        key_job_roles: program.key_job_roles ?? null,
        quant_or_qualitative: program.quant_or_qualitative ?? null,
        min_gpa: program.min_gpa ? Number(program.min_gpa) : null,
        gpa_type: program.gpa_type ?? null,
        type_of_program: program.type_of_program ?? null,
        percentage: program.percentage ? Number(program.percentage) : null,
        backlog: Number(program.backlog) || 0,
        min_work_exp: Number(program.min_work_exp) || 0,
        three_year_eleg: program.three_year_eleg ?? null,
      };
    });

    // Create programs
    console.log("Importing programs:", transformedPrograms);
    const created = await Promise.all(
      transformedPrograms.map((program) => prisma.programsGloveraFinal.create({ data: program }))
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
