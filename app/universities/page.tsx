import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universities | Glovera",
  description:
    "Explore top universities offering international education programs",
};

async function getUniversities() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/universities`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

export default async function Universities() {
  const universities = await getUniversities();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Explore Universities
        </h1>
      </main>
    </div>
  );
}
