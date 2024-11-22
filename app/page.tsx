import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to University Program Management</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find and apply to university programs worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Programs Section */}
          <div className="col-span-full">
            <h2 className="text-2xl font-semibold mb-4">Featured Programs</h2>
            {/* Add program cards here */}
          </div>

          {/* Basic auth to test */}
          <div className="col-span-full text-center mt-8">
            {JSON.stringify(session)}
            {session ? (
              <Link
                href="/programs"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse All Programs
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In to Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
