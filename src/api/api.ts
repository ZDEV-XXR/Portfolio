import {createClient} from "@supabase/supabase-js";

interface Service {
    id: string | number;
    name: string;
    url: string;
    status: "operational" | "down";
    updated_at?: string;
    created_at?: string;
}

interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    techStack: string[];
    githubUrl?: string;
    apkUrl?: string;
    externalUrl?: string;
    statusUrl?: string;
    category: "Web" | "Mobile" | "Automation";
    created_at?: string;
}

export interface Skill {
    id: string | number;
    name: string;
    category: string;
    icon: string;
    created_at?: string;
    updated_at?: string;
}

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const fetchServices = async (
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void,
    setServices: (services: Service[]) => void
) => {

    try {

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase credentials are missing in environment variables.");
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            throw error;
        }

        if (data) {
            setServices(data as Service[]);
        }
    } catch (err: any) {
        setError(err.message || "Failed to fetch status data.");
    } finally {
        setLoading(false);
    }
};



export const fetchProjects = async (
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void,
    setProjects: (projects: Project[]) => void
) => {

    try {

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase credentials are missing in environment variables.");
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            throw error;
        }

        if (data) {
            setProjects(data as Project[]);
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

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase credentials are missing in environment variables.");
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
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

export interface NewProjectInput {
    title: string;
    description: string;
    image: string;
    techStack: string[];
    category: Project["category"];
    apkUrl?: string;
    githubUrl?: string;
    externalUrl?: string;
}

export const postNewProject = async (project: NewProjectInput): Promise<void> => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are missing in environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from("projects").insert({
        title: project.title,
        description: project.description,
        image: project.image,
        techStack: project.techStack.join(", "),
        category: [project.category],
        apkUrl: project.apkUrl ?? null,
        githubUrl: project.githubUrl ?? null,
        externalUrl: project.externalUrl ?? null,
    });

    if (error) {
        throw new Error(`Could not save project: ${error.message}`);
    }
};

export const editProject = async (projectId: string | number, updatedProject: NewProjectInput): Promise<void> => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are missing in environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from("projects").update({
        title: updatedProject.title,
        description: updatedProject.description,
        image: updatedProject.image,
        techStack: updatedProject.techStack.join(", "),
        category: [updatedProject.category],
        apkUrl: updatedProject.apkUrl ?? null,
        githubUrl: updatedProject.githubUrl ?? null,
        externalUrl: updatedProject.externalUrl ?? null,
    }).eq("id", projectId);

    if (error) {
        throw new Error(`Could not update project: ${error.message}`);
    }
};

export const deleteProject = async (projectId: string | number): Promise<void> => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are missing in environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
        throw new Error(`Could not delete project: ${error.message}`);
    }
};
