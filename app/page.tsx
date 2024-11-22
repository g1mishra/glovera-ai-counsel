import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/authOptions";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <FeaturesSection />
          <div className="py-16 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Student Counseling?
            </h2>
            <Link
              href="/get-started"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-[#FF4B26] text-white font-semibold hover:bg-[#E63E1C] transition-colors text-lg"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
