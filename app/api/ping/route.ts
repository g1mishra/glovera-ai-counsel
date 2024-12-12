import { NextResponse } from "next/server";

const FAST_API_BASE_URL = process.env.FAST_API_BASE_URL;

export async function GET() {
  if (!FAST_API_BASE_URL) {
    return NextResponse.json({ error: "FAST_API_BASE_URL is not set" }, { status: 500 });
  }

  const response = await fetch(`${FAST_API_BASE_URL}/ping/`);
  const data = await response.json();
  return NextResponse.json(data);
}
