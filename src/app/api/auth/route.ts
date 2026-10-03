import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createToken } from "@/src/lib/auth";

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

async function verifyPassword(provided: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const pHash = await crypto.subtle.digest("SHA-256", enc.encode(provided));
  const eHash = await crypto.subtle.digest("SHA-256", enc.encode(expected));
  const pArr = new Uint8Array(pHash);
  const eArr = new Uint8Array(eHash);

  let diff = 0;
  for (let i = 0; i < pArr.length; i++) {
    diff |= pArr[i] ^ eArr[i];
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  const record = loginAttempts.get(ip);
  if (record && record.resetAt > now) {
    if (record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again later." },
        { status: 429 }
      );
    }
  } else if (record && record.resetAt <= now) {
    loginAttempts.delete(ip);
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { password } = body;
  if (typeof password !== "string" || !password) {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 }
    );
  }

  const adminPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const tokenSecret = process.env.ADMIN_ACCESS_TOKEN_SECRET;

  if (!adminPassword || !tokenSecret) {
    return NextResponse.json(
      { error: "Admin authentication is not configured on the server." },
      { status: 500 }
    );
  }

  const isMatch = await verifyPassword(password, adminPassword);
  if (!isMatch) {
    const current = loginAttempts.get(ip) || { count: 0, resetAt: now + LOCKOUT_DURATION_MS };
    current.count += 1;
    current.resetAt = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, current);

    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  // Success: reset attempts
  loginAttempts.delete(ip);

  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const token = await createToken(tokenSecret, expiresAt);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
