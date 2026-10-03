export const PROJECT_CATEGORIES = ["Web", "Mobile", "Automation"] as const;
export const CATEGORIES = ["All", "Web", "Mobile", "Automation"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type CategoryFilter = (typeof CATEGORIES)[number];

export interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    techStack: string[] | string | null;
    category: ProjectCategory;
    githubUrl?: string;
    apkUrl?: string;
    externalUrl?: string;
    statusUrl?: string;
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

export type ProjectFormState = {
    title: string;
    description: string;
    techStack: string;
    githubUrl: string;
    apkUrl: string;
    externalUrl: string;
    category: string;
};

export interface NewProjectInput {
    title: string;
    description: string;
    image: string;
    techStack: string[];
    category: ProjectCategory;
    apkUrl?: string;
    githubUrl?: string;
    externalUrl?: string;
}

export const inputClassName =
    "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:placeholder:text-slate-500";

export const labelClassName =
    "block text-sm font-semibold text-slate-800 dark:text-slate-200";

export function normalizeTechStack(techStack: unknown): string[] {
    if (Array.isArray(techStack)) {
        return techStack
            .filter((tech): tech is string => typeof tech === "string")
            .map((tech) => tech.trim())
            .filter(Boolean);
    }

    if (typeof techStack !== "string" || !techStack.trim()) {
        return [];
    }

    const value = techStack.trim().replace(/^\{\s*|\s*\}$/g, "");
    const technologies: string[] = [];
    let item = "";
    let quote: string | null = null;

    for (const character of value) {
        if ((character === '"' || character === "'") && (!quote || quote === character)) {
            quote = quote ? null : character;
        } else if (character === "," && !quote) {
            if (item.trim()) technologies.push(item.trim());
            item = "";
        } else {
            item += character;
        }
    }

    if (item.trim()) technologies.push(item.trim());

    return technologies;
}
