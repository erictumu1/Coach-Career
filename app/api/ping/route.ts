import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}

export async function HEAD() {
  // Return an empty 200 response for HEAD requests
  return new Response(null, { status: 200 });
}
