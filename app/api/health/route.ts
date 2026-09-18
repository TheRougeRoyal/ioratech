import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getDocs, collection, limit, query } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Basic check for Firestore connectivity
    const testQuery = query(collection(db, "users"), limit(1));
    await getDocs(testQuery);

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        api: "ok",
        firebase: "ok",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          api: "ok",
          firebase: "error",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
