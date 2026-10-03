"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectForm from "@/src/components/admin/ProjectForm";
import ProjectsTable from "@/src/components/admin/ProjectsTable";

export default function AdminConsole() {
  const [projectsVersion, setProjectsVersion] = useState(0);

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header navigation & controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white group-hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Admin Console
            </span>
          </div>
        </div>

        {/* Add Project Form */}
        <ProjectForm
          onSuccess={() => setProjectsVersion((version) => version + 1)}
        />

        {/* Section Separator */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50/50 dark:bg-slate-950 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Catalog & Management
            </span>
          </div>
        </div>

        {/* Projects Management Table */}
        <div id="projects-table" className="w-full">
          <ProjectsTable key={projectsVersion} />
        </div>
      </div>
    </main>
  );
}
