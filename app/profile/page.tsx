import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";

export const metadata: Metadata = {
  title: "Student Dashboard | Glovera",
  description: "Manage your applications and track your progress",
};

async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`
    // );
    // const data = await response.json();
    return session.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    redirect("/auth/login");
  }
}

export default async function Profile() {
  const user = await getUserProfile();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome, {user.name}
        </h1>
      </main>
    </div>
  );
}
