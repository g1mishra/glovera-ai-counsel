"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BarChart,
  Settings,
  Plus,
  Upload,
  Users,
  BookOpen,
  List,
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Programs",
      href: "/admin/programs",
      icon: GraduationCap,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
    },
    {
      title: "Query Patterns",
      href: "/admin/analytics/queries",
      icon: BookOpen,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed top-16 left-0 w-64 h-screen bg-white border-r border-t border-gray-200 z-50">
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? "text-[#FF4B26] bg-[#FFF5F3]"
                  : "text-gray-600 hover:text-[#FF4B26] hover:bg-[#FFF5F3]"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
