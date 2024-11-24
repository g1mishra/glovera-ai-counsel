"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="flex items-center justify-between flex-1 h-16 px-8">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              Glo<span className="text-[#FF4B26]">vera</span> A
              <span className="text-[#FF4B26]">I</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
