export const PROJECT_CATEGORIES = ["Web", "Mobile", "Automation"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type ProjectFormState = {
    title: string;
    description: string;
    techStack: string;
    githubUrl: string;
    apkUrl: string;
    externalUrl: string;
    category: string;
};

export const inputClassName =
    "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:placeholder:text-slate-500";

export const labelClassName =
    "block text-sm font-semibold text-slate-800 dark:text-slate-200";
