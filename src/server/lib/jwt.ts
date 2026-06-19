import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ApiError } from "./api-error";

const COOKIE_NAME = "wardia_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface JwtPayload {
  userId: string;
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return {
    userId: payload["userId"] as string,
    email: payload["email"] as string,
  };
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

/** Use in App Router API route handlers (server context) */
export async function getUserIdFromCookies(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) throw new ApiError("No autorizado", 401);
  try {
    const payload = await verifyToken(token);
    return payload.userId;
  } catch {
    throw new ApiError("No autorizado", 401);
  }
}

export { COOKIE_NAME };
