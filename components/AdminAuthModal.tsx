"use client";

import { signIn, useSession, signOut, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertTriangle, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "./Card";

interface AdminSignInForm {
  email: string;
  password: string;
}

export default function AdminAuthModal() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState<string>("");
  const { register, handleSubmit } = useForm<AdminSignInForm>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && session?.user?.role === "admin") {
      setShowModal(false);
    }
  }, [session]);

  const onSubmit = async (data: AdminSignInForm) => {
    setIsLoading(true);
    setError("");

    try {
      if (session) {
        await signOut({ redirect: false });
      }

      const result = await signIn("admin-login", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid admin credentials");
        return;
      }

      const sessionObject = await getSession();

      if (sessionObject?.user?.role !== "admin") {
        setError("Unauthorized access");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      setShowModal(false);
    } else {
      router.push("/");
    }
  };

  if (!showModal) return null;

  if (status === "loading") {
    return (
      <main className="flex bg-white/80 backdrop-blur-sm items-center justify-center h-[90vh]">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div>
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse mt-4"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex bg-white/80 backdrop-blur-sm items-center justify-center h-[90vh]">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-[#FF5033]" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {session && session.user?.role !== "admin" && (
            <div className="flex items-start space-x-3 bg-yellow-50 text-yellow-800 p-4 rounded-xl mb-6">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                You are currently logged in as {session.user?.email}. Signing in
                as admin will log you out of your current session.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="flex items-center justify-center space-x-2 text-red-500 text-sm p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    className="block w-full pl-11 rounded-xl h-12 border border-gray-200 shadow-sm focus:border-[#FF5033] focus:ring-[#FF5033] transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password", { required: true })}
                    type="password"
                    className="block w-full pl-11 rounded-xl h-12 border border-gray-200 shadow-sm focus:border-[#FF5033] focus:ring-[#FF5033] transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-[#FF5033] hover:bg-[#ff3813] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5033] disabled:opacity-50 transition-colors h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In as Admin"
                )}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-500">
                Protected Area
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            This is a secure area. Please verify your credentials to continue.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
