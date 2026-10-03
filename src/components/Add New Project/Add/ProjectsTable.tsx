"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProjects } from "@/src/api/api";
import { normalizeTechStack } from "@/src/components/Projects/techStack";

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

const categoryStyles: Record<Project["category"], string> = {
    Web: "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-950/40 dark:text-blue-300",
    Mobile:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950/40 dark:text-emerald-300",
    Automation:
        "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-950/40 dark:text-violet-300",
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

function truncateText(text: string, maxLength = 90) {
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
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [search, setSearch] = useState("");

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

        if (!query) {
            return projects;
        }

        return projects.filter((project) => {
            const technologies = normalizeTechStack(project.techStack);

            return (
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.category.toLowerCase().includes(query) ||
                technologies.some((technology) =>
                    technology.toLowerCase().includes(query)
                )
            );
        });
    }, [projects, search]);

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        onEdit?.(project);
    };

    const handleDelete = (project: Project) => {
        setSelectedProject(project);
        onDelete?.(project);
    };

    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            Projects
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Manage your projects and portfolio entries.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {/* Search */}
                        <div className="relative">
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
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search projects..."
                                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 sm:w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* States */}
            {loading ? (
                <div
                    role="status"
                    className="flex min-h-72 items-center justify-center px-6"
                >
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Loading projects...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex min-h-72 items-center justify-center px-6">
                    <div className="max-w-md text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
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
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-6 w-6"
                            >
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
                            {search
                                ? "No projects found"
                                : "No projects yet"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {search
                                ? "Try a different search term."
                                : "Add your first project to get started."}
                        </p>

                        {!search && onAdd && (
                            <button
                                type="button"
                                onClick={onAdd}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Add project
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[900px] text-left">
                            <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40">
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Project
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Tech stack
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredProjects.map((project) => {
                                const technologies = normalizeTechStack(
                                    project.techStack
                                );

                                const isSelected =
                                    selectedProject?.id === project.id;

                                return (
                                    <tr
                                        key={project.id}
                                        className={`transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                                            isSelected
                                                ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
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

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                        {project.title}
                                                    </p>
                                                    {project.created_at && (
                                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                            {formatDate(
                                                                project.created_at
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="max-w-xs px-6 py-4 align-top">
                                            <p
                                                title={
                                                    project.description
                                                }
                                                className="text-sm leading-6 text-slate-600 dark:text-slate-300"
                                            >
                                                {truncateText(
                                                    project.description
                                                )}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 align-top">
                                            {technologies.length > 0 ? (
                                                <ul
                                                    aria-label={`${project.title} tech stack`}
                                                    className="flex max-w-xs flex-wrap gap-1.5"
                                                >
                                                    {technologies
                                                        .slice(0, 4)
                                                        .map(
                                                            (
                                                                technology
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        technology
                                                                    }
                                                                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                                >
                                                                    {
                                                                        technology
                                                                    }
                                                                </li>
                                                            )
                                                        )}

                                                    {technologies.length >
                                                        4 && (
                                                            <li className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                                +
                                                                {technologies.length -
                                                                    4}
                                                            </li>
                                                        )}
                                                </ul>
                                            ) : (
                                                <span className="text-sm text-slate-400">
                                                        No technologies
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 align-top">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                        categoryStyles[
                                                            project.category
                                                            ]
                                                    }`}
                                                >
                                                    {project.category}
                                                </span>
                                        </td>

                                        <td className="px-6 py-4 text-right align-top">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(project)
                                                    }
                                                    aria-pressed={
                                                        isSelected
                                                    }
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            project
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-rose-900/60 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                                >
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
                    <div className="divide-y divide-slate-200 md:hidden dark:divide-slate-800">
                        {filteredProjects.map((project) => {
                            const technologies = normalizeTechStack(
                                project.techStack
                            );

                            return (
                                <article
                                    key={project.id}
                                    className="p-4"
                                >
                                    <div className="flex gap-3">
                                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
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
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                        {project.title}
                                                    </h3>

                                                    <span
                                                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                                                            categoryStyles[
                                                                project.category
                                                                ]
                                                        }`}
                                                    >
                                                        {project.category}
                                                    </span>
                                                </div>

                                                {project.created_at && (
                                                    <time className="shrink-0 text-xs text-slate-400">
                                                        {formatDate(
                                                            project.created_at
                                                        )}
                                                    </time>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        {truncateText(
                                            project.description,
                                            120
                                        )}
                                    </p>

                                    {technologies.length > 0 && (
                                        <ul
                                            aria-label={`${project.title} tech stack`}
                                            className="mt-3 flex flex-wrap gap-1.5"
                                        >
                                            {technologies
                                                .slice(0, 5)
                                                .map((technology) => (
                                                    <li
                                                        key={technology}
                                                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                    >
                                                        {technology}
                                                    </li>
                                                ))}
                                        </ul>
                                    )}

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(project)
                                            }
                                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(project)
                                            }
                                            className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-800 sm:px-6">
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
                    </div>
                </>
            )}
        </section>
    );
}