import { NextResponse } from "next/server";
import { createDoc, getDocsByQuery } from "@/lib/firestore";
import crypto from "crypto";

function getAllowedOrigins() {
  const origins = process.env.CORS_ORIGINS;
  if (!origins) return ["*"];
  return origins.split(",").map((o) => o.trim()).filter(Boolean);
}

function resolveCorsOrigin(request) {
  const allowed = getAllowedOrigins();
  if (allowed.includes("*")) return "*";
  const origin = request.headers.get("origin");
  if (origin && allowed.includes(origin)) return origin;
  return allowed[0];
}

function handleCORS(response, request) {
  response.headers.set("Access-Control-Allow-Origin", resolveCorsOrigin(request));
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Vary", "Origin");
  return response;
}

export async function OPTIONS(request) {
  return handleCORS(new NextResponse(null, { status: 200 }), request);
}

async function handleRoute(request, { params }) {
  const { path = [] } = params;
  const route = `/${path.join("/")}`;
  const method = request.method;

  try {
    if (route === "/" || route === "/root") {
      if (method === "GET") {
        return handleCORS(NextResponse.json({ message: "Hello World" }), request);
      }
    }

    if (route === "/status" && method === "POST") {
      const body = await request.json();
      if (!body.client_name) {
        return handleCORS(NextResponse.json({ error: "client_name is required" }, { status: 400 }), request);
      }

      const id = crypto.randomUUID();
      await createDoc("status_checks", id, {
        client_name: body.client_name,
        timestamp: new Date().toISOString(),
      });

      return handleCORS(NextResponse.json({ id, client_name: body.client_name }), request);
    }

    if (route === "/status" && method === "GET") {
      const checks = await getDocsByQuery("status_checks");
      return handleCORS(NextResponse.json(checks), request);
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }), request);
  } catch (error) {
    console.error("API Error:", error);
    return handleCORS(
      NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 }),
      request
    );
  }
}

export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const DELETE = handleRoute;
export const PATCH = handleRoute;
