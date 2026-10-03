import { NextResponse, type NextRequest } from "next/server";
import { verifyAddProjectToken } from "@/src/lib/addProjectAccess";

const COOKIE_NAME = "add_project_access";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isAuthorized = await verifyAddProjectToken(
        token,
        process.env.ADD_PROJECT_SESSION_SECRET?.trim()
    );

    if (isAuthorized) {
        return NextResponse.next();
    }

    const redirectUrl = new URL("/add", request.url);
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ["/add/new", "/add/new/:path*"],
};
