"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "../icons/google";
import { Card, CardContent, CardHeader } from "../Card";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const session = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";
  const error = searchParams.get("error");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <Card className="border shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome to Glovera AI
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to access your personalized AI counseling experience
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-fade-in">
              {error === "OAuthAccountNotLinked"
                ? "This email is already associated with another account."
                : "An error occurred during sign in. Please try again."}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => handleGoogleSignIn()}
              className="w-full flex items-center justify-center px-6 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <GoogleIcon className="size-5" />
                <span className="text-gray-700 font-medium">
                  Continue with Google
                </span>
              </div>
            </button>

            <button
              onClick={() => router.push("/admin")}
              className="w-full flex items-center justify-center px-6 py-3.5 bg-[#FF5033] hover:bg-[#ff3813] rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="size-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-white font-medium">Login as Admin</span>
              </div>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-500">Secure Login</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Protected by Google Authentication</span>
            </div>
            <p className="text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
