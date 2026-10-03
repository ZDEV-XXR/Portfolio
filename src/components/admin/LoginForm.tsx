"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
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
            const response = await fetch("/api/auth", {
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

            router.push("/admin");
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
                        Enter your password to continue to the administration console.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="access-password"
                            className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                        >
                            Access password
                        </label>
                        <div className="relative mt-2">
                            <input
                                id="access-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={inputPassword}
                                onChange={(event) =>
                                    handlePasswordChange(event.target.value)
                                }
                                placeholder="Enter password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                aria-invalid={Boolean(error)}
                                aria-describedby={error ? "password-error" : undefined}
                                className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                                    error
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-500"
                                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showPassword ? (
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            d="M3 3l18 18M10.5 10.677a2 2 0 0 0 2.823 2.823M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M9.88 4.604A10.84 10.84 0 0 1 12 4c3.718 0 7.111 3.009 9 6a15.46 15.46 0 0 1-2.158 2.84"
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
                                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
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

                        {error && (
                            <p
                                id="password-error"
                                role="alert"
                                className="mt-2 text-xs text-rose-600 dark:text-rose-400"
                            >
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !inputPassword.trim()}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Verifying..." : "Verify and continue"}
                    </button>
                </form>
            </section>
        </main>
    );
}
