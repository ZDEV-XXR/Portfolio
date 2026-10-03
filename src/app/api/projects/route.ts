import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AUTH_COOKIE_NAME, verifyToken } from "@/src/lib/auth";
import { insertProject, updateProject, removeProject } from "@/src/lib/db-server";
import { PROJECT_CATEGORIES, type NewProjectInput, type ProjectCategory } from "@/src/lib/types";

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
  return verifyToken(token, secret);
}

function validateProjectPayload(body: Record<string, unknown>): {
  valid: boolean;
  error?: string;
  data?: NewProjectInput;
} {
  const { title, description, image, techStack, category, apkUrl, githubUrl, externalUrl } = body;

  if (typeof title !== "string" || !title.trim()) {
    return { valid: false, error: "Title is required." };
  }
  if (typeof description !== "string" || !description.trim()) {
    return { valid: false, error: "Description is required." };
  }
  if (typeof image !== "string" || !image.trim()) {
    return { valid: false, error: "Image URL is required." };
  }
  if (!Array.isArray(techStack) || techStack.length === 0) {
    return { valid: false, error: "At least one technology is required." };
  }
  if (
    typeof category !== "string" ||
    !PROJECT_CATEGORIES.includes(category as ProjectCategory)
  ) {
    return { valid: false, error: "Valid category is required." };
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      techStack: techStack.map((t) => String(t).trim()).filter(Boolean),
      category: category as ProjectCategory,
      apkUrl: typeof apkUrl === "string" && apkUrl.trim() ? apkUrl.trim() : undefined,
      githubUrl: typeof githubUrl === "string" && githubUrl.trim() ? githubUrl.trim() : undefined,
      externalUrl: typeof externalUrl === "string" && externalUrl.trim() ? externalUrl.trim() : undefined,
    },
  };
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateProjectPayload(body);
  if (!validation.valid || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    await insertProject(validation.data);
    revalidatePath("/");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = body;
  if (!id || (typeof id !== "string" && typeof id !== "number")) {
    return NextResponse.json({ error: "Valid project id is required." }, { status: 400 });
  }

  const validation = validateProjectPayload(body);
  if (!validation.valid || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    await updateProject(id, validation.data);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const idFromQuery = url.searchParams.get("id");

  let id: string | number | null = idFromQuery;
  if (!id) {
    try {
      const body = await req.json();
      id = body.id;
    } catch {
      // ignore
    }
  }

  if (!id) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  try {
    await removeProject(id);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
