import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";
import { isProfileComplete } from "@/utils/profile";
import AIChat from "@/components/ai-chat/AIChat";

export default async function GetStarted() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!isProfileComplete(session.user?.profile)) {
    redirect("/onboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 p-6 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Video Counseling
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect instantly with our AI counselor for personalized guidance
          </p>
        </div>
        <AIChat user={session.user} />
      </main>
    </div>
  );
}
