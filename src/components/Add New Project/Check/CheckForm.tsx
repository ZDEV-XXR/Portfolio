"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CheckForm() {
    const [inputPassword, setInputPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/add-access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: inputPassword }),
            });
            const result: unknown = await response.json();

            if (!response.ok) {
                const message =
                    typeof result === "object" && result !== null &&
                    "error" in result && typeof result.error === "string"
                        ? result.error
                        : "Could not verify your password. Please try again.";
                setError(message);
                return;
            }

            router.push("/add/new");
            router.refresh();
        } catch {
            setError("Could not verify your password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordChange = (value: string) => {
        setInputPassword(value);

        if (error) {
            setError("");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6">
            <section
                aria-labelledby="check-form-title"
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-6 w-6"
                    >
                        <path
                            d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 14v3"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <div className="mb-7">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                        Restricted access
                    </p>
                    <h1
                        id="check-form-title"
                        className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
                    >
                        Verify your access
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Enter your password to continue and add a new item.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="access-password"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="access-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={inputPassword}
                                onChange={(event) =>
                                    handlePasswordChange(event.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                aria-invalid={Boolean(error)}
                                aria-describedby={
                                    error ? "password-error" : "password-hint"
                                }
                                className={`block w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
                                    error
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-500"
                                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700"
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                                aria-pressed={showPassword}
                                className="absolute inset-y-0 right-0 inline-flex items-center justify-center rounded-r-xl px-4 text-slate-500 transition hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:text-slate-100"
                            >
                                {showPassword ? (
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11.5 11.5 0 0 1 12 5c5.2 0 8.8 4.3 10 7-.4.9-1.2 2-2.3 3M6.2 6.2C3.9 7.6 2.5 9.7 2 12c.5 1.1 2.1 3.8 5.5 5.3"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="3"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error ? (
                            <p
                                id="password-error"
                                role="alert"
                                className="mt-2 flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V7Zm.75 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{error}</span>
                            </p>
                        ) : (
                            <p
                                id="password-hint"
                                className="mt-2 text-xs text-slate-500 dark:text-slate-400"
                            >
                                Your password is used to verify access.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:translate-y-px dark:focus-visible:ring-offset-slate-900"
                    >
                        {isSubmitting ? "Verifying..." : "Continue"}
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
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-4 w-4"
                    >
                        <path
                            d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2m-8 0h9a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Access is limited to authorized users
                </div>
            </section>
        </main>
    );
}
