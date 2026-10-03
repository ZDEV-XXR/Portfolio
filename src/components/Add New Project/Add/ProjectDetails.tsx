import type {ProjectFormState} from "./ProjectFormTypes";
import {
    inputClassName,
    labelClassName,
    PROJECT_CATEGORIES,
} from "./ProjectFormTypes";

interface ProjectDetailsProps {
    form: ProjectFormState;
    errors: Record<string, string>;
    technologies: string[];
    updateField: (field: keyof ProjectFormState, value: string) => void;
}

export default function ProjectDetails({
    form,
    errors,
    technologies,
    updateField,
}: ProjectDetailsProps) {
    return (
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
                        Technology stack <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="techStack"
                        name="techStack"
                        type="text"
                        value={form.techStack}
                        onChange={(event) => updateField("techStack", event.target.value)}
                        placeholder="React, TypeScript, Tailwind CSS"
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
                            Separate each technology with a comma.
                        </p>
                    )}
                    {technologies.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technology tags preview">
                            {technologies.map((technology) => (
                                <li
                                    key={technology}
                                    className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300"
                                >
                                    {technology}
                                </li>
                            ))}
                        </ul>
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
                        <option value="">Select a category</option>
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
    );
}
