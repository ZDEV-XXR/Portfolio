import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { NewProjectInput } from "./types";

export function getServerClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
    }
    if (!serviceRoleKey) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
    }

    return createClient(supabaseUrl.trim(), serviceRoleKey.trim(), {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function insertProject(project: NewProjectInput): Promise<void> {
    const supabase = getServerClient();
    const { error } = await supabase.from("projects").insert({
        title: project.title.trim(),
        description: project.description.trim(),
        image: project.image.trim(),
        techStack: project.techStack.join(", "),
        category: project.category,
        apkUrl: project.apkUrl?.trim() || null,
        githubUrl: project.githubUrl?.trim() || null,
        externalUrl: project.externalUrl?.trim() || null,
    });

    if (error) {
        throw new Error(`Could not insert project: ${error.message}`);
    }
}

export async function updateProject(
    projectId: string | number,
    updatedProject: NewProjectInput
): Promise<void> {
    const supabase = getServerClient();
    const { error } = await supabase.from("projects").update({
        title: updatedProject.title.trim(),
        description: updatedProject.description.trim(),
        image: updatedProject.image.trim(),
        techStack: updatedProject.techStack.join(", "),
        category: updatedProject.category,
        apkUrl: updatedProject.apkUrl?.trim() || null,
        githubUrl: updatedProject.githubUrl?.trim() || null,
        externalUrl: updatedProject.externalUrl?.trim() || null,
    }).eq("id", projectId);

    if (error) {
        throw new Error(`Could not update project: ${error.message}`);
    }
}

export async function removeProject(projectId: string | number): Promise<void> {
    const supabase = getServerClient();
    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
        throw new Error(`Could not delete project: ${error.message}`);
    }
}
