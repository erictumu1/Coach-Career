import { NextResponse } from "next/server";

const allowedMethods = ['GET', 'HEAD', 'OPTIONS'];

function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: allowedMethods.join(', ') },
  });
}

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: allowedMethods.join(', '),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": allowedMethods.join(', '),
    },
  });
}

// Catch all other methods explicitly with 405 response
export async function POST() {
  return methodNotAllowed();
}
export async function PUT() {
  return methodNotAllowed();
}
export async function DELETE() {
  return methodNotAllowed();
}
export async function PATCH() {
  return methodNotAllowed();
}
export async function TRACE() {
  return methodNotAllowed();
}
export async function CONNECT() {
  return methodNotAllowed();
}
export async function PURGE() {
  return methodNotAllowed();
}
export async function COPY() {
  return methodNotAllowed();
}
export async function LOCK() {
  return methodNotAllowed();
}
export async function UNLOCK() {
  return methodNotAllowed();
}
export async function PROPFIND() {
  return methodNotAllowed();
}
export async function VIEW() {
  return methodNotAllowed();
}
