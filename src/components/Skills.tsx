"use client";
import { motion } from "framer-motion";

const skills = [
  { name: "Next.js", color: "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" },
  { name: "React", color: "bg-sky-500 text-white" },
  { name: "TypeScript", color: "bg-blue-600 text-white" },
  { name: "JavaScript", color: "bg-yellow-400 text-slate-900" },
  { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
  { name: "Kotlin", color: "bg-purple-600 text-white" },
  { name: "Jetpack Compose", color: "bg-green-600 text-white" },
  { name: "Android", color: "bg-emerald-500 text-white" },
  { name: "Firebase", color: "bg-amber-500 text-white" },
  { name: "HTML5 & CSS3", color: "bg-orange-500 text-white" },
  { name: "Git & GitHub", color: "bg-slate-700 text-white" },
  { name: "REST APIs", color: "bg-rose-500 text-white" },
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
