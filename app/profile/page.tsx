"use client";

import { useSession } from "next-auth/react";
import ProfileForm from "@/components/profile/ProfileForm";

export default function Profile() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-lg text-gray-600">View and manage your profile information</p>
        </div>
        <ProfileForm user={session.user} />
      </main>
    </div>
  );
}
