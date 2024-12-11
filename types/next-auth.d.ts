import { Profile } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      profile?: Profile;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    profile?: Profile;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    profile?: Profile;
  }
}

export type Role = "student" | "admin";
