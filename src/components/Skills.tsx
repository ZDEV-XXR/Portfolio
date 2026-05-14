"use client";
import { motion } from "framer-motion";

const skills = [
  { name: "Next.js", color: "bg-slate-200 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300 border border-slate-300 dark:border-slate-700" },
  { name: "React", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200 dark:border-sky-800" },
  { name: "TypeScript", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800" },
  { name: "JavaScript", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800" },
  { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800" },
  { name: "Kotlin", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800" },
  { name: "Jetpack Compose", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800" },
  { name: "Android", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" },
  { name: "Firebase", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800" },
  { name: "HTML5 & CSS3", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800" },
  { name: "Git & GitHub", color: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border border-slate-200 dark:border-slate-700" },
  { name: "REST APIs", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800" },
];

export default function Skills() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
          Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ scale: 1.08, y: -2 }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm cursor-default transition-shadow hover:shadow-md ${skill.color}`}
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
