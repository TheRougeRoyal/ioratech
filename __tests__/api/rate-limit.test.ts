import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit";

const mockLimit = jest.fn();

jest.mock("@upstash/ratelimit", () => {
  return {
    Ratelimit: jest.fn().mockImplementation(() => ({
      limit: mockLimit,
    })),
  };
});

// Mock the static method slidingWindow
(require("@upstash/ratelimit").Ratelimit as any).slidingWindow = jest.fn().mockReturnValue({});

jest.mock("@upstash/redis", () => {
  return {
    Redis: jest.fn().mockImplementation(() => ({})),
  };
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "example_token";
    jest.clearAllMocks();
  });

  it("should allow requests when under the limit", async () => {
    mockLimit.mockResolvedValue({
      success: true,
      remaining: 4,
      reset: 1000,
    });

    const result = await checkRateLimit("test-user", AUTH_RATE_LIMIT);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("should block requests when over the limit", async () => {
    mockLimit.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: 1000,
    });

    const result = await checkRateLimit("test-user", AUTH_RATE_LIMIT);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  describe("In-Memory Fallback Limiter", () => {
    beforeEach(() => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    });

    it("should block requests after threshold and reset on window rollover", async () => {
      const config = { windowMs: 1000, maxRequests: 2, keyPrefix: "test_fallback" };
      const id = "user_fallback_" + Date.now();

      // Request 1: allowed
      const res1 = await checkRateLimit(id, config);
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(1);

      // Request 2: allowed
      const res2 = await checkRateLimit(id, config);
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(0);

      // Request 3: blocked after threshold
      const res3 = await checkRateLimit(id, config);
      expect(res3.allowed).toBe(false);
      expect(res3.remaining).toBe(0);

      // Advance time past window rollover
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(Date.now() + 1500);

      // Request 4: allowed after window rollover reset
      const res4 = await checkRateLimit(id, config);
      expect(res4.allowed).toBe(true);
      expect(res4.remaining).toBe(1);

      nowSpy.mockRestore();
    });
  });
});
