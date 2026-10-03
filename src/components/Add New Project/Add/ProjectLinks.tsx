import type {ProjectFormState} from "./ProjectFormTypes";
import {inputClassName, labelClassName} from "./ProjectFormTypes";

interface ProjectLinksProps {
    form: ProjectFormState;
    errors: Record<string, string>;
    updateField: (field: keyof ProjectFormState, value: string) => void;
}

const LINK_FIELDS = [
    {
        id: "githubUrl",
        label: "GitHub repository",
        placeholder: "https://github.com/username/project",
        hint: "Link to the source code.",
    },
    {
        id: "apkUrl",
        label: "APK download",
        placeholder: "https://example.com/app.apk",
        hint: "Link to the Android application package.",
    },
    {
        id: "externalUrl",
        label: "Live demo or external link",
        placeholder: "https://your-project.com",
        hint: "A deployed website, demo, or related page.",
    },
] as const;

export default function ProjectLinks({
    form,
    errors,
    updateField,
}: ProjectLinksProps) {
    return (
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
    );
}
