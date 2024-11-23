"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, User } from "lucide-react";
import { NavItem, User as UserType } from "@/types";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user?: UserType | null;
}

const navItems: NavItem[] = [
  {
    label: "Programs Explorer",
    href: "/programs",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (path: string): boolean => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                Glo<span className="text-[#FF4B26]">vera</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  isActiveLink(item.href)
                    ? "text-[#FF4B26] font-medium"
                    : "text-gray-600 hover:text-[#FF4B26]"
                } transition-colors`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/profile"}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#FF4B26]"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#FF4B26]"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md ${
                    isActiveLink(item.href)
                      ? "text-[#FF4B26] bg-gray-50 font-medium"
                      : "text-gray-600 hover:text-[#FF4B26] hover:bg-gray-50"
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/profile"}
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-[#FF4B26] hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-[#FF4B26] hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
