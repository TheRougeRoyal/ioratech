import { NextRequest } from "next/server";
import { GET as getDashboardData } from "@/app/api/dashboard/data/route";
import { GET as getEmissions } from "@/app/api/dashboard/emissions/route";
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

jest.mock("@/lib/firestore", () => ({
  getDocById: jest.fn().mockResolvedValue({ id: "user-123" }),
  getDocsByQuery: jest.fn().mockResolvedValue([]),
}));

describe("Protected Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/dashboard/data", () => {
    it("should reject requests with missing authorization token", async () => {
      const req = new NextRequest("http://localhost:3000/api/dashboard/data");
      const res = await getDashboardData(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("UNAUTHORIZED");
    });

    it("should reject requests with an invalid authorization token", async () => {
      (verifyToken.verifyFirebaseToken as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/dashboard/data", {
        headers: { Authorization: "Bearer invalid_token" },
      });
      const res = await getDashboardData(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("UNAUTHORIZED");
    });

    it("should allow requests with a valid authorization token", async () => {
      (verifyToken.verifyFirebaseToken as jest.Mock).mockResolvedValue({
        user_id: "user-123",
        email: "user@example.com",
      });
      const req = new NextRequest("http://localhost:3000/api/dashboard/data", {
        headers: { Authorization: "Bearer valid_token" },
      });
      const res = await getDashboardData(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe("GET /api/dashboard/emissions", () => {
    it("should reject requests with missing authorization token", async () => {
      const req = new NextRequest("http://localhost:3000/api/dashboard/emissions");
      const res = await getEmissions(req);
      expect(res.status).toBe(401);
    });

    it("should reject requests with invalid authorization token", async () => {
      (verifyToken.verifyFirebaseToken as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/dashboard/emissions", {
        headers: { Authorization: "Bearer invalid_token" },
      });
      const res = await getEmissions(req);
      expect(res.status).toBe(401);
    });
  });
});
