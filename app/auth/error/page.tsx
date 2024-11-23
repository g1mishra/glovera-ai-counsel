"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthSignin":
        return "Error occurred while signing in with Google";
      case "OAuthCallback":
        return "Error occurred while processing Google sign-in";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account";
      case "SessionRequired":
        return "Please sign in to access this page";
      default:
        return "An unexpected error occurred during sign in";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-4 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Error
          </h2>

          <p className="text-gray-600 mb-8">{getErrorMessage(error)}</p>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="flex items-center justify-center w-full px-6 py-3 bg-[#FF4B26] text-white font-semibold rounded-lg hover:bg-[#E63E1C] transition-colors"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center w-full px-6 py-3 border border-[#FF4B26] text-[#FF4B26] font-semibold rounded-lg hover:bg-[#FFF5F3] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link href="/contact" className="text-[#FF4B26] hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
