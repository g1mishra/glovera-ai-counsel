"use client";

import Navbar from "@/components/Navbar";
import { User } from "@/types";
import { getBasePath } from "@/utils/getBasePath";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface ConditionalNavbarProps {
  user: User | null;
}

const ConditionalNavbar = ({ user }: ConditionalNavbarProps) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch(`${getBasePath()}/api/ping`);
      } catch (error) {
        console.error("Failed to ping server:", error);
      }
    };

    pingServer();

    const pingInterval = setInterval(pingServer, 3 * 60 * 1000);

    return () => clearInterval(pingInterval);
  }, []);

  if (isAdminRoute) {
    return null;
  }

  return <Navbar user={user} />;
};

export default ConditionalNavbar;
