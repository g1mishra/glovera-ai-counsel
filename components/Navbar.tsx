"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn, User, LogOut, Settings } from "lucide-react";
import { NavItem, User as UserType } from "@/types";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveLink = (path: string): boolean => {
    return pathname === path;
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                Glo<span className="text-[#FF4B26]">vera</span> A
                <span className="text-[#FF4B26]">I</span>
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#FF4B26]"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href={user.role === "admin" ? "/admin" : "/profile"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {user.role === "admin"
                          ? "Admin Dashboard"
                          : "Profile Settings"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
                <>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/profile"}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-[#FF4B26] hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-[#FF4B26] hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              ) : (
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
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
