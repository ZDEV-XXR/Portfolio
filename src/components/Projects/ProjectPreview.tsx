"use client";

import { useEffect, useId, useRef } from "react";
import { normalizeTechStack } from "@/src/components/Projects/techStack";

interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    techStack?: string[] | string | null;
    githubUrl?: string;
}

interface ProjectPreviewProps {
    project: Project;
    onClose: () => void;
}

export default function ProjectPreview({
    project,
    onClose,
}: ProjectPreviewProps) {
    const technologies = normalizeTechStack(project.techStack);
    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            // Keep keyboard focus inside the modal while it is open.
            if (event.key === "Tab" && dialogRef.current) {
                const focusableElements =
                    dialogRef.current.querySelectorAll<HTMLElement>(
                        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (!firstElement || !lastElement) {
                    event.preventDefault();
                } else if (
                    event.shiftKey &&
                    document.activeElement === firstElement
                ) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastElement
                ) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/30 outline-none dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                            Project overview
                        </p>
                        <h2
                            id={titleId}
                            className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
                        >
                            {project.title}
                        </h2>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close project preview"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-4 w-4"
                        >
                            <path
                                d="m5 5 10 10M15 5 5 15"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6 px-5 py-5 sm:px-7 sm:py-7">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={`${project.title} project preview`}
                                className="aspect-[16/9] max-h-[420px] w-full object-cover"
                            />
                        ) : (
                            <div
                                role="img"
                                aria-label={`No preview image available for ${project.title}`}
                                className="flex aspect-[16/9] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400"
                            >
                                Preview image unavailable
                            </div>
                        )}
                    </div>

                    <section aria-labelledby={`${titleId}-description`}>
                        <h3
                            id={`${titleId}-description`}
                            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                        >
                            About this project
                        </h3>
                        <p
                            id={descriptionId}
                            className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base"
                        >
                            {project.description}
                        </p>
                    </section>

                    <section aria-labelledby={`${titleId}-stack`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3
                                id={`${titleId}-stack`}
                                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                            >
                                Technology stack
                            </h3>
                            {technologies.length > 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {technologies.length}{" "}
                                    {technologies.length === 1
                                        ? "technology"
                                        : "technologies"}
                                </span>
                            )}
                        </div>

                        {technologies.length > 0 ? (
                            <ul
                                aria-label="Technologies used"
                                className="mt-3 flex flex-wrap gap-2"
                            >
                                {technologies.map((technology) => (
                                    <li
                                        key={technology}
                                        className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300"
                                    >
                                        {technology}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                No technologies listed.
                            </p>
                        )}
                    </section>
                </div>

                <div className="mt-auto flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-end sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-900"
                    >
                        Close
                    </button>

                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} source code on GitHub (opens in a new tab)`}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:ring-offset-slate-900"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4"
                            >
                                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                            </svg>
                            View on GitHub
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="h-3.5 w-3.5"
                            >
                                <path
                                    d="M7 4h9v9M16 4 8 12M14 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
