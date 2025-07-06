import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

// Allow OPTIONS for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Allow": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    }
  });
}

// Optionally, respond with 405 for other methods instead of default 405
export async function POST() {
  return new Response("Method Not Allowed", { status: 405 });
}
