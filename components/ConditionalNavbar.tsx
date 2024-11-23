"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { User } from "@/types";

interface ConditionalNavbarProps {
  user: User | null;
}

const ConditionalNavbar = ({ user }: ConditionalNavbarProps) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return <Navbar user={user} />;
};

export default ConditionalNavbar;
