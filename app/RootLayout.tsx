import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/authOptions";
import Navbar from "@/components/Navbar";
import { User } from "@/types";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Navbar user={(session?.user as User) ?? null} />
      {children}
    </>
  );
}

export default RootLayout;
