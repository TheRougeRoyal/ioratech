import { jwtVerify, importSPKI, type JWTPayload } from "jose";

const GOOGLE_PUBLIC_KEYS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let cachedKeys: Record<string, CryptoKey> = {};
let keysFetchedAt = 0;

async function getSigningKey(kid: string): Promise<CryptoKey> {
  const now = Date.now();
  if (now - keysFetchedAt > 3600000 || !cachedKeys[kid]) {
    const res = await fetch(GOOGLE_PUBLIC_KEYS_URL);
    const data = await res.json();
    cachedKeys = {};
    for (const [keyKid, pem] of Object.entries(data)) {
      const key = await importSPKI(pem as string, "RS256");
      cachedKeys[keyKid] = key;
    }
    keysFetchedAt = now;
  }
  return cachedKeys[kid];
}

export interface FirebaseJwtPayload extends JWTPayload {
  user_id: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
  };
}

function decodeJwtHeader(token: string): { kid?: string } {
  try {
    const headerSegment = token.split(".")[0];
    const padded = headerSegment.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export async function verifyFirebaseToken(token: string): Promise<FirebaseJwtPayload | null> {
  try {
    const header = decodeJwtHeader(token);
    const kid = header.kid;
    if (!kid) return null;

    const key = await getSigningKey(kid);
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
      console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");
      return null;
    }

    const { payload } = await jwtVerify(token, key, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    return payload as FirebaseJwtPayload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}
