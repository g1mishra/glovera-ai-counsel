import { authOptions } from "@/app/api/auth/authOptions";
import LoginForm from "@/components/auth/LoginForm";
import { LogIn } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Glovera",
  description: "Access your Glovera account using your Google credentials",
};

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session && session?.user?.role === "admin") {
    redirect("/admin");
  }

  if (session && session?.user?.role === "student") {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <main className="max-w-lg w-full px-4 sm:px-6 lg:px-8 py-12 border border-gray-100 rounded-xl shadow">
        <LoginForm />
      </main>
    </div>
  );
}
