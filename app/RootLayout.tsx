import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/authOptions";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { User } from "@/types";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <ConditionalNavbar user={(session?.user as User) || null} />
        <main>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
