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
      title: "Student Engagement",
      href: "/admin/analytics/engagement",
      icon: Users,
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
    <aside className="fixed left-0 w-64 h-screen bg-white border-r border-gray-200 z-50">
      <div className="h-16 px-6 border-b border-gray-200 flex items-center ">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">
            Glo<span className="text-[#FF4B26]">vera</span>
          </span>
        </Link>
      </div>
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

            {item.submenu && (
              <div className="ml-5 mt-1 space-y-1">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(subItem.href)
                        ? "text-[#FF4B26] bg-[#FFF5F3]"
                        : "text-gray-600 hover:text-[#FF4B26] hover:bg-[#FFF5F3]"
                    }`}
                  >
                    <subItem.icon className="w-4 h-4 mr-3" />
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
