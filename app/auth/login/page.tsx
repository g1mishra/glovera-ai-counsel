import { Metadata } from "next";
import { LogIn } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Glovera",
  description: "Access your Glovera account using your Google credentials",
};

export default function Login() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-[#FFF5F3] p-4 rounded-full">
                  <LogIn className="w-8 h-8 text-[#FF4B26]" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome to Glovera
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Sign in with your Google account to access your personalized
                dashboard, track applications, and get program recommendations
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
