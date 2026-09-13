import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import * as verifyToken from "@/lib/verify-token";

jest.mock("@/lib/verify-token", () => ({
  verifyFirebaseToken: jest.fn(),
}));

jest.mock("@/lib/rate-limit", () => ({
  checkRateLimit: jest.fn().mockResolvedValue({
    allowed: true,
    remaining: 10,
    resetTime: Date.now() + 60000,
  }),
  rateLimitResponse: jest.fn(),
  applyRateLimitHeaders: jest.fn(),
  AUTH_RATE_LIMIT: {},
  API_RATE_LIMIT: {},
  HEALTH_RATE_LIMIT: {},
  KEY_MGMT_RATE_LIMIT: {},
  getClientIp: jest.fn(),
}));

describe("requireAuth", () => {
  it("should reject requests without an authorization header", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/protected"));
    const result = await requireAuth(request);
    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Missing authorization header");
  });

  it("should reject requests with an invalid token", async () => {
    (verifyToken.verifyFirebaseToken as jest.Mock).mockResolvedValue(null);
    const request = new NextRequest(new URL("http://localhost:3000/api/protected"), {
      headers: {
        Authorization: "Bearer invalid-token",
      },
    });
    const result = await requireAuth(request);
    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Invalid or expired token");
  });

  it("should allow requests with a valid token", async () => {
    (verifyToken.verifyFirebaseToken as jest.Mock).mockResolvedValue({
      user_id: "user-123",
      email: "test@example.com",
    });
    const request = new NextRequest(new URL("http://localhost:3000/api/protected"), {
      headers: {
        Authorization: "Bearer valid-token",
      },
    });
    const result = await requireAuth(request);
    expect(result.authenticated).toBe(true);
    expect(result.userId).toBe("user-123");
  });
});
