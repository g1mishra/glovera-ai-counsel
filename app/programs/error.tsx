"use client";

import React from "react";
import Navbar from "@/components/Navbar";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-8">
            {error.message || "An error occurred while loading the programs."}
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#FF4B26] text-white font-semibold rounded-lg hover:bg-[#E63E1C] transition-colors mr-4"
          >
            Try again
          </button>
          <a
            href="/contact"
            className="px-6 py-3 border border-[#FF4B26] text-[#FF4B26] font-semibold rounded-lg hover:bg-[#FFF5F3] transition-colors inline-block"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}
