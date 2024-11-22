'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
            Authentication Error
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {error || 'An error occurred during authentication'}
          </p>
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 