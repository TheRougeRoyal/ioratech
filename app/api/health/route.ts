import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      api: "ok",
      firebase: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "configured" : "missing",
    },
  });
}
