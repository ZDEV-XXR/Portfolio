interface CoverImageProps {
    imageUrl: string;
    error?: string;
    onChange: (value: string) => void;
}

export default function CoverImage({
    imageUrl,
    error,
    onChange,
}: CoverImageProps) {
    return (
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
                onChange={(event) => onChange(event.target.value)}
                placeholder="https://example.com/project-cover.png"
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "image-error" : "image-hint"}
                className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                    error
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-500"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700"
                }`}
            />
            {error ? (
                <p id="image-error" className="mt-2 text-xs text-rose-600" role="alert">
                    {error}
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
    );
}
