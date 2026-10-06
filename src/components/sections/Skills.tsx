"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSkills } from "@/src/lib/db";
import type { Skill } from "@/src/lib/types";

const CATEGORY_STYLES: Record<string, string> = {
  Web: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  Mobile: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DevOps & Automation": "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Tools: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
};

const DEFAULT_SKILL_STYLE =
  "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

export default function Skills() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    void fetchSkills(setError, setLoading, setSkills);
  }, []);

  const categories = ["All", ...new Set(skills.map((skill) => skill.category))];
  const filteredSkills =
    active === "All"
      ? skills
      : skills.filter((skill) => skill.category === active);

  return (
    <section id="skills" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
          Skills
        </h2>

        {error ? (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            Could not load skills: {error.message}
          </p>
        ) : loading ? (
          <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
            Loading skills...
          </p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No skills to display.
          </p>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter skills by category">
              {categories.map((category) => {
                const isSelected = active === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActive(category)}
                    aria-pressed={isSelected}
                    className={`relative rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                      isSelected
                        ? "border-transparent text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="activeSkillCategory"
                        className="absolute inset-0 rounded-full bg-indigo-600 shadow-md shadow-indigo-500/25"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>

            <motion.div
              layout
              transition={{ layout: { duration: 0.25, ease: "easeOut" } }}
              className="flex flex-wrap gap-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, index) => (
                  <motion.span
                    key={`${skill.category}-${skill.name}`}
                    layout
                    initial={{ opacity: 0, scale: 0.88, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.85,
                      y: -6,
                      transition: { duration: 0.12, ease: "easeOut" },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 28,
                      mass: 0.6,
                      delay: Math.min(index * 0.015, 0.08),
                      layout: {
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      },
                    }}
                    whileHover={{ scale: 1.04, y: -2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex cursor-default items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition-shadow hover:shadow-md ${
                      CATEGORY_STYLES[skill.category] ?? DEFAULT_SKILL_STYLE
                    }`}
                  >
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    )}
                    {skill.name}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </motion.div>
    </section>
  );
}
