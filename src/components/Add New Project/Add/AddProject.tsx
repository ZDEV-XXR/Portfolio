"use client";

import {
    useMemo,
    useState,
    type FormEvent,
} from "react";
import CoverImage from "./CoverImage";
import ProjectDetails from "./ProjectDetails";
import ProjectLinks from "./ProjectLinks";
import {
    PROJECT_CATEGORIES,
    type ProjectCategory,
    type ProjectFormState,
} from "./ProjectFormTypes";

export type {ProjectCategory} from "./ProjectFormTypes";

export interface NewProjectData {
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    apkUrl?: string;
    externalUrl?: string;
    category: ProjectCategory;
    image: string;
}

interface AddProjectProps {
    /**
     * Connect this callback to your API/server action.
     * The component validates and prepares the project data, but does not
     * assume a backend endpoint or persistence format.
     */
    onSubmit?: (project: NewProjectData) => void | Promise<void>;
    onCancel?: () => void;
    className?: string;
}

const INITIAL_FORM: ProjectFormState = {
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    apkUrl: "",
    externalUrl: "",
    category: "",
};

function parseTechStack(value: string): string[] {
    return Array.from(
        new Set(
            value
                .split(",")
                .map((technology) => technology.trim())
                .filter(Boolean)
        )
    );
}

function isValidOptionalUrl(value: string): boolean {
    if (!value.trim()) return true;

    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export default function AddProject({
    onSubmit,
    onCancel,
    className,
}: AddProjectProps) {
    const [form, setForm] = useState<ProjectFormState>(INITIAL_FORM);
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const technologies = useMemo(
        () => parseTechStack(form.techStack),
        [form.techStack]
    );

    const updateField = (field: keyof ProjectFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => {
            if (!current[field]) return current;
            const next = { ...current };
            delete next[field];
            return next;
        });
        setSubmitError("");
        setSubmitSuccess("");
    };

    const handleImageUrlChange = (value: string) => {
        setImageUrl(value);
        setErrors((current) => {
            const next = { ...current };
            delete next.image;
            return next;
        });
        setSubmitError("");
        setSubmitSuccess("");
    };

    const validate = (): Record<string, string> => {
        const nextErrors: Record<string, string> = {};

        if (!form.title.trim()) {
            nextErrors.title = "Enter a project title.";
        }

        if (!form.description.trim()) {
            nextErrors.description = "Add a short project description.";
        }

        if (!technologies.length) {
            nextErrors.techStack = "Add at least one technology, separated by commas.";
        }

        if (!form.category) {
            nextErrors.category = "Choose a project category.";
        } else if (
            !PROJECT_CATEGORIES.includes(form.category as ProjectCategory)
        ) {
            nextErrors.category = "Choose a valid project category.";
        }

        if (!imageUrl.trim()) {
            nextErrors.image = "Enter a project image URL.";
        } else if (!isValidOptionalUrl(imageUrl)) {
            nextErrors.image = "Image URL must be a valid http:// or https:// URL.";
        }

        const urlFields: Array<keyof Pick<
            ProjectFormState,
            "githubUrl" | "apkUrl" | "externalUrl"
        >> = ["githubUrl", "apkUrl", "externalUrl"];

        for (const field of urlFields) {
            if (!isValidOptionalUrl(form[field])) {
                const label =
                    field === "githubUrl"
                        ? "GitHub URL"
                        : field === "apkUrl"
                          ? "APK URL"
                          : "External URL";
                nextErrors[field] = `${label} must be a valid http:// or https:// URL.`;
            }
        }

        return nextErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        const nextErrors = validate();
        setErrors(nextErrors);
        setSubmitError("");
        setSubmitSuccess("");

        if (Object.keys(nextErrors).length > 0) {
            const firstInvalidField = Object.keys(nextErrors)[0];
            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        if (!imageUrl.trim()) return;

        if (!onSubmit) {
            setSubmitError(
                "The form is valid, but no save handler is connected yet. Pass an onSubmit callback to save projects."
            );
            return;
        }

        const payload: NewProjectData = {
            title: form.title.trim(),
            description: form.description.trim(),
            techStack: technologies,
            githubUrl: form.githubUrl.trim() || undefined,
            apkUrl: form.apkUrl.trim() || undefined,
            externalUrl: form.externalUrl.trim() || undefined,
            category: form.category as ProjectCategory,
            image: imageUrl.trim(),
        };

        try {
            setIsSubmitting(true);
            await onSubmit(payload);
            setSubmitSuccess("Project added successfully.");
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Could not save the project. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setImageUrl("");
        setErrors({});
        setSubmitError("");
        setSubmitSuccess("");
    };

    return (
        <section className={`w-full ${className ?? ""}`}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Portfolio management
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                        Add a project
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                        Share the details, tools, and links that help visitors
                        understand what you built.
                    </p>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-6">
                        <ProjectDetails
                            form={form}
                            errors={errors}
                            technologies={technologies}
                            updateField={updateField}
                        />
                        <ProjectLinks
                            form={form}
                            errors={errors}
                            updateField={updateField}
                        />
                    </div>

                    <aside className="space-y-6">
                        <CoverImage
                            imageUrl={imageUrl}
                            error={errors.image}
                            onChange={handleImageUrlChange}
                        />

                        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/30 sm:p-6">
                            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="h-4 w-4"
                                >
                                    <path
                                        d="M10 2.5 12 7l4.5 2-4.5 2-2 4.5L8 11l-4.5-2L8 7l2-4.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="m16 13 .9 2.1L19 16l-2.1.9L16 19l-.9-2.1L13 16l2.1-.9L16 13Z"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                A helpful tip
                            </div>
                            <p className="mt-2 text-sm leading-6 text-indigo-900/80 dark:text-indigo-200/80">
                                A concise description, relevant technologies, and a working demo link make it easier for visitors to explore your work.
                            </p>
                        </section>
                    </aside>
                </div>

                {submitError && (
                    <div
                        role="alert"
                        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
                    >
                        {submitError}
                    </div>
                )}
                {submitSuccess && (
                    <div
                        role="status"
                        className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
                    >
                        {submitSuccess}
                    </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="text-rose-500">*</span> Required fields
                    </p>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
                        >
                            Reset form
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-4 w-4 animate-spin"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            opacity=".25"
                                        />
                                        <path
                                            d="M21 12a9 9 0 0 0-9-9"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Saving project…
                                </>
                            ) : (
                                <>
                                    Add project
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M4 10h12m-5-5 5 5-5 5"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}
