import { prisma } from "@/lib/prisma";
import { Role } from "@/types/next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "student",
        };
      },
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            role: "admin",
          },
        });

        if (!admin || !admin.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, admin.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: "admin",
          image: admin.image || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      if (user && token.role === "student") {
        try {
          const profile = await prisma.profile.findUnique({
            where: {
              userId: token.id as string,
            },
          });

          if (profile) {
            token.profile = {
              id: profile.id,
              userId: profile.userId,
              undergraduate_degree: profile.undergraduate_degree,
              university: profile.university,
              gpa: profile.gpa,
              percentage: profile.percentage,
              backlogs: profile.backlogs,
              naac_grade: profile.naac_grade,
              program_type: profile.program_type,
              language_proficiency: profile.language_proficiency as {
                test_type: string;
                overall_score: string;
              } | null,
              work_experience_years: profile.work_experience_years,
              technical_skills: profile.technical_skills,
              preferred_study_countries: profile.preferred_study_countries,
              target_intake: profile.target_intake,
              budget_range: profile.budget_range,
              eligible_programs: profile.eligible_programs,
            };
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.profile = token.profile;
      }
      return session;
    },
  },
  // debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};
