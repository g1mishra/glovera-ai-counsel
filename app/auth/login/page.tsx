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
    <div className="min-h-[calc(100vh-64px)] bg-white flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
