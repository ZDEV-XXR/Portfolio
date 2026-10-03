"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
    PROJECT_CATEGORIES,
    type ProjectCategory,
    type ProjectFormState,
    inputClassName,
    labelClassName,
} from "@/src/lib/types";

interface ProjectFormProps {
    onSuccess?: () => void;
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

const LINK_FIELDS = [
    {
        id: "githubUrl" as const,
        label: "GitHub repository",
        placeholder: "https://github.com/username/project",
        hint: "Link to the source code.",
    },
    {
        id: "apkUrl" as const,
        label: "APK download",
        placeholder: "https://example.com/app.apk",
        hint: "Link to the Android application package.",
    },
    {
        id: "externalUrl" as const,
        label: "Live demo or external link",
        placeholder: "https://your-project.com",
        hint: "A deployed website, demo, or related page.",
    },
] as const;

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

export default function ProjectForm({
    onSuccess,
    onCancel,
    className,
}: ProjectFormProps) {
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

        const payload = {
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
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                window.location.href = "/admin";
                return;
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Could not save the project. Please try again.");
            }

            setSubmitSuccess("Project added successfully.");
            setForm(INITIAL_FORM);
            setImageUrl("");
            setErrors({});
            onSuccess?.();
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
        <form
            onSubmit={handleSubmit}
            noValidate
            className={`space-y-8 ${className || ""}`}
        >
            {submitSuccess && (
                <div
                    role="status"
                    className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
                >
                    <div className="flex items-center gap-3">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L9.25 10.69 7.28 8.72a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l4-4Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="font-semibold">{submitSuccess}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSubmitSuccess("")}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-100"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {submitError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9.25 6.75a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0v-4.5ZM10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="font-semibold">Unable to save project</p>
                        <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
                            {submitError}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    {/* Project Details */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Project details
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Start with a clear name and a concise overview.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="title" className={labelClassName}>
                                    Project title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={(event) => updateField("title", event.target.value)}
                                    placeholder="e.g. Personal Finance Dashboard"
                                    autoComplete="off"
                                    required
                                    maxLength={100}
                                    aria-invalid={Boolean(errors.title)}
                                    aria-describedby={errors.title ? "title-error" : undefined}
                                    className={`${inputClassName} ${
                                        errors.title
                                            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                                            : ""
                                    }`}
                                />
                                {errors.title && (
                                    <p id="title-error" className="mt-2 text-xs text-rose-600" role="alert">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <label htmlFor="description" className={labelClassName}>
                                        Description <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-xs tabular-nums text-slate-400">
                                        {form.description.length}/1000
                                    </span>
                                </div>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={(event) => updateField("description", event.target.value)}
                                    placeholder="What does the project do? Mention its purpose, key features, or the problem it solves."
                                    rows={5}
                                    maxLength={1000}
                                    required
                                    aria-invalid={Boolean(errors.description)}
                                    aria-describedby={
                                        errors.description ? "description-error" : "description-hint"
                                    }
                                    className={`${inputClassName} min-h-32 resize-y leading-6 ${
                                        errors.description
                                            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                                            : ""
                                    }`}
                                />
                                {errors.description ? (
                                    <p id="description-error" className="mt-2 text-xs text-rose-600" role="alert">
                                        {errors.description}
                                    </p>
                                ) : (
                                    <p id="description-hint" className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        Keep it clear and helpful for someone viewing your portfolio.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="techStack" className={labelClassName}>
                                    Technologies <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="techStack"
                                    name="techStack"
                                    type="text"
                                    value={form.techStack}
                                    onChange={(event) => updateField("techStack", event.target.value)}
                                    placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                                    autoComplete="off"
                                    required
                                    aria-invalid={Boolean(errors.techStack)}
                                    aria-describedby={
                                        errors.techStack ? "techStack-error" : "techStack-hint"
                                    }
                                    className={`${inputClassName} ${
                                        errors.techStack
                                            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                                            : ""
                                    }`}
                                />
                                {errors.techStack ? (
                                    <p id="techStack-error" className="mt-2 text-xs text-rose-600" role="alert">
                                        {errors.techStack}
                                    </p>
                                ) : (
                                    <p id="techStack-hint" className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        Separate technologies with commas.
                                    </p>
                                )}

                                {technologies.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {technologies.map((technology) => (
                                            <span
                                                key={technology}
                                                className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                                            >
                                                {technology}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="category" className={labelClassName}>
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={(event) => updateField("category", event.target.value)}
                                    required
                                    aria-invalid={Boolean(errors.category)}
                                    aria-describedby={errors.category ? "category-error" : undefined}
                                    className={`${inputClassName} ${
                                        errors.category
                                            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                                            : ""
                                    }`}
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>
                                    {PROJECT_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p id="category-error" className="mt-2 text-xs text-rose-600" role="alert">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Project Links */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Project links
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Add relevant destinations. All links are optional.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {LINK_FIELDS.map((field) => (
                                <div key={field.id}>
                                    <label htmlFor={field.id} className={labelClassName}>
                                        {field.label}
                                    </label>
                                    <input
                                        id={field.id}
                                        name={field.id}
                                        type="url"
                                        inputMode="url"
                                        autoComplete="url"
                                        value={form[field.id]}
                                        onChange={(event) => updateField(field.id, event.target.value)}
                                        placeholder={field.placeholder}
                                        aria-invalid={Boolean(errors[field.id])}
                                        aria-describedby={
                                            errors[field.id] ? `${field.id}-error` : `${field.id}-hint`
                                        }
                                        className={`${inputClassName} ${
                                            errors[field.id]
                                                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                                                : ""
                                        }`}
                                    />
                                    {errors[field.id] ? (
                                        <p id={`${field.id}-error`} className="mt-2 text-xs text-rose-600" role="alert">
                                            {errors[field.id]}
                                        </p>
                                    ) : (
                                        <p id={`${field.id}-hint`} className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            {field.hint}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Cover Image */}
                <div className="space-y-8 lg:col-span-1">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Cover image <span className="text-rose-500">*</span>
                            </h2>
                            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                                Choose a visual that represents your project.
                            </p>
                        </div>

                        <label htmlFor="image" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Image URL <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="image"
                            name="image"
                            type="url"
                            inputMode="url"
                            autoComplete="url"
                            value={imageUrl}
                            onChange={(event) => handleImageUrlChange(event.target.value)}
                            placeholder="https://example.com/project-cover.png"
                            required
                            aria-invalid={Boolean(errors.image)}
                            aria-describedby={errors.image ? "image-error" : "image-hint"}
                            className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                                errors.image
                                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-500"
                                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700"
                            }`}
                        />
                        {errors.image ? (
                            <p id="image-error" className="mt-2 text-xs text-rose-600" role="alert">
                                {errors.image}
                            </p>
                        ) : (
                            <p id="image-hint" className="mt-2 break-words text-xs text-slate-500 dark:text-slate-400">
                                Enter a publicly accessible image URL.
                            </p>
                        )}
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Project cover preview"
                                className="mt-4 aspect-video w-full rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                            />
                        )}
                    </section>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel || handleReset}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                    {onCancel ? "Cancel" : "Reset"}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Saving project..." : "Publish project"}
                </button>
            </div>
        </form>
    );
}
