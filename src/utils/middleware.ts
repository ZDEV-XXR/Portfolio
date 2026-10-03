import { NextResponse, type NextRequest } from "next/server";
import { verifyAddProjectToken } from "@/src/lib/addProjectAccess";

const COOKIE_NAME = "add_project_access";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isAuthorized = await verifyAddProjectToken(
        token,
        process.env.ADD_PROJECT_SESSION_SECRET
    );

    if (isAuthorized) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/add", request.url));
}

export const config = {
    matcher: ["/add/new/:path*"],
};
