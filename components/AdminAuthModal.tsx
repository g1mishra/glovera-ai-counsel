"use client";

import { signIn, useSession, signOut, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <main className="flex bg-white items-center justify-center h-[90vh]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex bg-white items-center justify-center h-[90vh]">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Admin Access Required</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {session && session.user?.role !== "admin" && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4">
            You are currently logged in as {session.user?.email}. Signing in as admin will log you
            out of your current session.
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="text-red-500 text-center text-sm mb-4">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="mt-1 block w-full rounded-md h-10 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                className="mt-1 block w-full rounded-md h-10 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
