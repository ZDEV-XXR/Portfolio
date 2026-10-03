"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProjects, editProject, deleteProject, type NewProjectInput } from "@/src/api/api";
import { normalizeTechStack } from "@/src/components/Projects/techStack";
import { AnimatePresence, motion } from "framer-motion";

interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    techStack: string[] | string | null;
    githubUrl?: string;
    apkUrl?: string;
    externalUrl?: string;
    category: "Web" | "Mobile" | "Automation";
    created_at?: string;
}

interface ProjectsTableProps {
    onAdd?: () => void;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
}

const CATEGORIES = ["All", "Web", "Mobile", "Automation"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const categoryStyles: Record<Project["category"], string> = {
    Web: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-500/30",
    Mobile:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30",
    Automation:
        "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-500/30",
};

function formatDate(date?: string) {
    if (!date) return "—";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(parsedDate);
}

function truncateText(text: string, maxLength = 85) {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
}

export default function ProjectsTable({
    onAdd,
    onEdit,
    onDelete,
}: ProjectsTableProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");

    // Modal states
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [editForm, setEditForm] = useState<{
        title: string;
        description: string;
        category: Project["category"];
        techStack: string;
        image: string;
        githubUrl: string;
        externalUrl: string;
        apkUrl: string;
    }>({
        title: "",
        description: "",
        category: "Web",
        techStack: "",
        image: "",
        githubUrl: "",
        externalUrl: "",
        apkUrl: "",
    });
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editError, setEditError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 4000);
    };

    const loadProjects = useCallback(() => {
        setError(null);
        setLoading(true);
        void fetchProjects(setError, setLoading, setProjects);
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesCategory =
                selectedCategory === "All" || project.category === selectedCategory;

            if (!matchesCategory) return false;
            if (!query) return true;

            const technologies = normalizeTechStack(project.techStack);
            return (
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.category.toLowerCase().includes(query) ||
                technologies.some((tech) => tech.toLowerCase().includes(query))
            );
        });
    }, [projects, search, selectedCategory]);

    // Open Edit modal
    const handleOpenEdit = (project: Project) => {
        onEdit?.(project);
        const techs = normalizeTechStack(project.techStack).join(", ");
        setEditForm({
            title: project.title,
            description: project.description,
            category: project.category,
            techStack: techs,
            image: project.image,
            githubUrl: project.githubUrl || "",
            externalUrl: project.externalUrl || "",
            apkUrl: project.apkUrl || "",
        });
        setEditError("");
        setProjectToEdit(project);
    };

    // Save Edit
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectToEdit) return;

        if (!editForm.title.trim()) {
            setEditError("Project title is required.");
            return;
        }

        const techStackArray = Array.from(
            new Set(
                editForm.techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
            )
        );

        if (!techStackArray.length) {
            setEditError("At least one technology is required.");
            return;
        }

        setIsSavingEdit(true);
        setEditError("");

        try {
            const payload: NewProjectInput = {
                title: editForm.title.trim(),
                description: editForm.description.trim(),
                category: editForm.category,
                image: editForm.image.trim(),
                techStack: techStackArray,
                githubUrl: editForm.githubUrl.trim() || undefined,
                externalUrl: editForm.externalUrl.trim() || undefined,
                apkUrl: editForm.apkUrl.trim() || undefined,
            };

            await editProject(projectToEdit.id, payload);
            setProjectToEdit(null);
            showToast(`"${editForm.title}" updated successfully.`);
            loadProjects();
        } catch (err: unknown) {
            setEditError(
                err instanceof Error ? err.message : "Failed to update project."
            );
        } finally {
            setIsSavingEdit(false);
        }
    };

    // Open Delete confirmation
    const handleOpenDelete = (project: Project) => {
        onDelete?.(project);
        setDeleteError("");
        setProjectToDelete(project);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        setIsDeleting(true);
        setDeleteError("");

        try {
            await deleteProject(projectToDelete.id);
            const deletedTitle = projectToDelete.title;
            setProjectToDelete(null);
            showToast(`"${deletedTitle}" deleted successfully.`);
            loadProjects();
        } catch (err: unknown) {
            setDeleteError(
                err instanceof Error ? err.message : "Failed to delete project."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            {/* Toast Alert */}
            {toastMessage && (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/60 px-6 py-2.5 flex items-center justify-between text-sm text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{toastMessage}</span>
                    </div>
                    <button
                        onClick={() => setToastMessage("")}
                        className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Header & Controls */}
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Existing Projects
                            </h2>
                            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                {projects.length}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Search, filter, edit, or delete projects in your live portfolio database.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <label htmlFor="project-search" className="sr-only">
                                Search projects
                            </label>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            >
                                <path
                                    d="m14.5 14.5 3 3m-1.5-8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <input
                                id="project-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by title, tech..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {onAdd && (
                            <button
                                type="button"
                                onClick={onAdd}
                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Project
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-xs font-medium text-slate-400 mr-1">Filter:</span>
                    {CATEGORIES.map((cat) => {
                        const count =
                            cat === "All"
                                ? projects.length
                                : projects.filter((p) => p.category === cat).length;
                        const isSelected = selectedCategory === cat;

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                    isSelected
                                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                }`}
                            >
                                <span>{cat}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                        isSelected
                                            ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900 font-semibold"
                                            : "bg-slate-200/80 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* States */}
            {loading ? (
                <div role="status" className="flex min-h-72 items-center justify-center px-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Loading projects from database...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex min-h-72 items-center justify-center px-6">
                    <div className="max-w-md text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9.25 6.75a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0v-4.5ZM10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                            Unable to load projects
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {error.message || "Something went wrong."}
                        </p>
                        <button
                            type="button"
                            onClick={loadProjects}
                            className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex min-h-72 items-center justify-center px-6">
                    <div className="text-center max-w-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                <path
                                    d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="m7 16 3.5-3.5 2.5 2.5 2-2L18 16M8 9h.01"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                            {search || selectedCategory !== "All"
                                ? "No matching projects found"
                                : "No projects in database yet"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {search || selectedCategory !== "All"
                                ? "Try adjusting your search query or category filter."
                                : "Use the form above to add your first project."}
                        </p>
                        {(search || selectedCategory !== "All") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory("All");
                                }}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[850px] text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Project
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Description
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Tech stack
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Category
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Links
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredProjects.map((project) => {
                                    const technologies = normalizeTechStack(project.techStack);

                                    return (
                                        <tr
                                            key={project.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            {/* Project Thumbnail & Title */}
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 shadow-sm">
                                                        {project.image ? (
                                                            <img
                                                                src={project.image}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                                —
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 max-w-[180px]">
                                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white" title={project.title}>
                                                            {project.title}
                                                        </p>
                                                        {project.created_at && (
                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                {formatDate(project.created_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="max-w-xs px-6 py-4 align-top">
                                                <p
                                                    title={project.description}
                                                    className="text-xs leading-5 text-slate-600 dark:text-slate-300"
                                                >
                                                    {truncateText(project.description)}
                                                </p>
                                            </td>

                                            {/* Tech Stack */}
                                            <td className="px-6 py-4 align-top">
                                                {technologies.length > 0 ? (
                                                    <ul
                                                        aria-label={`${project.title} tech stack`}
                                                        className="flex max-w-[200px] flex-wrap gap-1"
                                                    >
                                                        {technologies.slice(0, 3).map((technology) => (
                                                            <li
                                                                key={technology}
                                                                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                            >
                                                                {technology}
                                                            </li>
                                                        ))}
                                                        {technologies.length > 3 && (
                                                            <li className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                                +{technologies.length - 3}
                                                            </li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No tech</span>
                                                )}
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4 align-top">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        categoryStyles[project.category]
                                                    }`}
                                                >
                                                    {project.category}
                                                </span>
                                            </td>

                                            {/* Links */}
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-1.5">
                                                    {project.githubUrl && (
                                                        <a
                                                            href={project.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="GitHub Repository"
                                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {project.externalUrl && (
                                                        <a
                                                            href={project.externalUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Live Demo"
                                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {!project.githubUrl && !project.externalUrl && (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right align-top">
                                                <div className="flex justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(project)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 shadow-sm"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenDelete(project)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-300 dark:border-rose-900/60 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/40 shadow-sm"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
                        {filteredProjects.map((project) => {
                            const technologies = normalizeTechStack(project.techStack);

                            return (
                                <article key={project.id} className="p-4 sm:p-5">
                                    <div className="flex gap-3">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                                            {project.image ? (
                                                <img
                                                    src={project.image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                                    —
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                        {project.title}
                                                    </h3>
                                                    <span
                                                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                            categoryStyles[project.category]
                                                        }`}
                                                    >
                                                        {project.category}
                                                    </span>
                                                </div>

                                                {project.created_at && (
                                                    <time className="shrink-0 text-[11px] text-slate-400">
                                                        {formatDate(project.created_at)}
                                                    </time>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                        {truncateText(project.description, 110)}
                                    </p>

                                    {technologies.length > 0 && (
                                        <ul className="mt-3 flex flex-wrap gap-1">
                                            {technologies.slice(0, 4).map((tech) => (
                                                <li
                                                    key={tech}
                                                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                >
                                                    {tech}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                                >
                                                    GitHub ↗
                                                </a>
                                            )}
                                            {project.externalUrl && (
                                                <a
                                                    href={project.externalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                                                >
                                                    Live Demo ↗
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEdit(project)}
                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenDelete(project)}
                                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-800 sm:px-6 flex items-center justify-between">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Showing{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {filteredProjects.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {projects.length}
                            </span>{" "}
                            projects
                            {search && ` matching "${search}"`}
                        </p>
                        {selectedCategory !== "All" && (
                            <span className="text-xs text-slate-400">
                                Filtered by: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedCategory}</span>
                            </span>
                        )}
                    </div>
                </>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {projectToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !isDeleting && setProjectToDelete(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-4">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Delete project?
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Are you sure you want to permanently delete{" "}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    "{projectToDelete.title}"
                                </span>
                                ? This action will remove it from your portfolio and database.
                            </p>

                            {deleteError && (
                                <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                    {deleteError}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={() => setProjectToDelete(null)}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={handleConfirmDelete}
                                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Deleting…
                                        </>
                                    ) : (
                                        "Yes, delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* EDIT PROJECT MODAL */}
            <AnimatePresence>
                {projectToEdit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !isSavingEdit && setProjectToEdit(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Edit Project
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Update project information and live links.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setProjectToEdit(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            value={editForm.category}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    category: e.target.value as Project["category"],
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                        >
                                            <option value="Web">Web</option>
                                            <option value="Mobile">Mobile</option>
                                            <option value="Automation">Automation</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tech Stack (comma separated) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.techStack}
                                            onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })}
                                            placeholder="React, Next.js, Supabase"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={editForm.image}
                                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            GitHub URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={editForm.githubUrl}
                                            onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Live Demo URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={editForm.externalUrl}
                                            onChange={(e) => setEditForm({ ...editForm, externalUrl: e.target.value })}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {editError && (
                                    <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                        {editError}
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <button
                                        type="button"
                                        disabled={isSavingEdit}
                                        onClick={() => setProjectToEdit(null)}
                                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingEdit}
                                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                                    >
                                        {isSavingEdit ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Saving…
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
