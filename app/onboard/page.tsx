import StudentProfileForm from "@/components/shared/StudentProfileForm";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/authOptions";

export const metadata: Metadata = {
  title: "Complete Your Profile | Glovera",
  description: "Complete your profile to access AI counseling",
};

export default async function Onboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-lg text-gray-600">
            We need some information to provide you with the best guidance
          </p>
        </div>
        <StudentProfileForm user={session.user} submitLabel="Complete Profile" mode="onboarding" />
      </main>
    </div>
  );
}
