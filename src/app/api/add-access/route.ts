import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAddProjectToken } from "@/src/lib/addProjectAccess";

const COOKIE_NAME = "add_project_access";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

export async function POST(request: Request) {
    const expectedPassword = process.env.ADD_PROJECT_PASSWORD?.trim();
    const sessionSecret = process.env.ADD_PROJECT_SESSION_SECRET?.trim();

    if (!expectedPassword || !sessionSecret) {
        return NextResponse.json(
            { error: "Add-project access is not configured on the server." },
            { status: 500 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const password =
        typeof body === "object" && body !== null && "password" in body &&
        typeof body.password === "string"
            ? body.password.trim()
            : "";

    const expectedHash = createHash("sha256").update(expectedPassword).digest();
    const providedHash = createHash("sha256").update(password).digest();

    if (!timingSafeEqual(expectedHash, providedHash)) {
        return NextResponse.json(
            { error: "Incorrect password. Please try again." },
            { status: 401 }
        );
    }

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    const token = await createAddProjectToken(sessionSecret, expiresAt);
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}
