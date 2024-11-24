"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "../icons/google";

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
    <div className="w-full max-w-md mx-auto space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error === "OAuthAccountNotLinked"
            ? "This email is already associated with another account."
            : "An error occurred during sign in. Please try again."}
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Sign in to continue</h2>
        <p className="text-sm text-gray-600 mt-2">Use your Google account to access all features</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleGoogleSignIn()}
          className="w-full flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <GoogleIcon className="size-5" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </div>
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 border border-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-200"
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

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Protected by Google</span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure authentication powered by Google</span>
        </div>
        <p className="text-xs text-gray-500">
          By continuing, you agree to Glovera's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
