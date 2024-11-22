import Link from "next/link";
import { MessageCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Student Counseling Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your international education journey with our intelligent
            video bot assistant. No more waiting - get instant, personalized
            guidance 24/7.
          </p>
          <div className="flex gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[#FF4B26] text-white font-semibold hover:bg-[#E63E1C] transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-[#FF4B26] text-[#FF4B26] font-semibold hover:bg-[#FFF5F3] transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageCircle className="w-16 h-16 text-[#FF4B26]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
