export function getBasePath(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || "http://localhost:3000";
  return baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
}
