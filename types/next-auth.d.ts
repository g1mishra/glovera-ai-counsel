import { UserProfile } from "@/types";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      profile?: UserProfile;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    profile?: UserProfile;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    profile?: UserProfile;
  }
}

export type Role = "student" | "admin";
