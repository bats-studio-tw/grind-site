import { SignJWT, jwtVerify } from "jose";

export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface JWTPayload {
  [key: string]: unknown;
  address: string;
  exp?: number;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch {
    throw new Error("Invalid token");
  }
}
