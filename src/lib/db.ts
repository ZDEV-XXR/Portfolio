import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Project, ProjectCategory, Skill } from "./types";

function validateAnonKey(key: string | undefined): void {
    if (!key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
    }
    if (key.startsWith("eyJ")) {
        try {
            const parts = key.split(".");
            if (parts.length >= 2) {
                const base64Url = parts[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
                const binaryStr = typeof atob === "function"
                    ? atob(padded)
                    : Buffer.from(padded, "base64").toString("binary");
                const bytes = new Uint8Array(binaryStr.length);
                for (let i = 0; i < binaryStr.length; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                }
                const decodedJson = JSON.parse(new TextDecoder().decode(bytes));
                if (decodedJson && decodedJson.role === "service_role") {
                    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY contains a service_role key. Use the anon/publishable key.");
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.message.includes("service_role")) {
                throw err;
            }
        }
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}
validateAnonKey(supabaseAnonKey);

export function getPublicSupabaseClient(): SupabaseClient {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are missing in environment variables.");
    }
    return createClient(supabaseUrl.trim(), supabaseAnonKey.trim());
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl.trim(), supabaseAnonKey.trim())
    : null;

export function normalizeCategory(category: unknown): ProjectCategory {
    if (typeof category === "string") {
        const cleaned = category.replace(/^[\[{\"\s]+|[\]}\"\s]+$/g, "").trim();
        if (cleaned === "Mobile" || cleaned === "Automation") {
            return cleaned;
        }
        return "Web";
    }
    if (Array.isArray(category) && category.length > 0) {
        return normalizeCategory(category[0]);
    }
    return "Web";
}

export const fetchProjects = async (
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void,
    setProjects: (projects: Project[]) => void
) => {
    try {
        const client = getPublicSupabaseClient();
        const { data, error } = await client
            .from("projects")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            throw error;
        }

        if (data) {
            const formatted = (data as Array<Record<string, unknown>>).map((proj) => ({
                ...proj,
                category: normalizeCategory(proj.category),
            }));
            setProjects(formatted as unknown as Project[]);
        }
    } catch (err: unknown) {
        const message = err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
                ? err.message
                : "Failed to fetch projects data.";
        setError(new Error(message));
    } finally {
        setLoading(false);
    }
};

export const fetchSkills = async (
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void,
    setSkills: (skills: Skill[]) => void
) => {
    try {
        const client = getPublicSupabaseClient();
        const { data, error } = await client
            .from("skills")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            throw error;
        }

        if (data) {
            setSkills(data as Skill[]);
        }
    } catch (err: unknown) {
        const message = err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
                ? err.message
                : "Failed to fetch skills data.";
        setError(new Error(message));
    } finally {
        setLoading(false);
    }
};
