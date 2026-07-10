"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiTailwindcss,
  SiHtml5, SiKotlin, SiJetpackcompose, SiAndroid, SiFirebase,
  SiGithub, SiMake, SiGit, SiAndroidstudio,
} from "react-icons/si";
import { MdOutlineApi } from "react-icons/md";
import { VscAzureDevops, VscVscode } from "react-icons/vsc";
import { TbAutomation, TbSparkles } from "react-icons/tb";

const categories = ["All", "Web", "Mobile", "DevOps & Automation", "Tools"] as const;
type Category = (typeof categories)[number];

interface Skill {
  name: string;
  color: string;
  category: Exclude<Category, "All">;
  icon: React.ReactNode;
}

const skills: Skill[] = [
  // Web
  {
    name: "Next.js",
    color: "bg-slate-200 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
    category: "Web",
    icon: <SiNextdotjs className="w-4 h-4" />,
  },
  {
    name: "React",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
    category: "Web",
    icon: <SiReact className="w-4 h-4" />,
  },
  {
    name: "TypeScript",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    category: "Web",
    icon: <SiTypescript className="w-4 h-4" />,
  },
  {
    name: "JavaScript",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800",
    category: "Web",
    icon: <SiJavascript className="w-4 h-4" />,
  },
  {
    name: "Tailwind CSS",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800",
    category: "Web",
    icon: <SiTailwindcss className="w-4 h-4" />,
  },
  {
    name: "HTML5 & CSS3",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
    category: "Web",
    icon: <SiHtml5 className="w-4 h-4" />,
  },
  {
    name: "REST APIs",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    category: "Web",
    icon: <MdOutlineApi className="w-4 h-4" />,
  },
  // Mobile
  {
    name: "Kotlin",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
    category: "Mobile",
    icon: <SiKotlin className="w-4 h-4" />,
  },
  {
    name: "Jetpack Compose",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800",
    category: "Mobile",
    icon: <SiJetpackcompose className="w-4 h-4" />,
  },
  {
    name: "Android",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    category: "Mobile",
    icon: <SiAndroid className="w-4 h-4" />,
  },
  {
    name: "Firebase",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    category: "Mobile",
    icon: <SiFirebase className="w-4 h-4" />,
  },
  // DevOps & Automation
  {
    name: "Git & GitHub",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    category: "DevOps & Automation",
    icon: <SiGit className="w-4 h-4" />,
  },
  {
    name: "DevOps",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
    category: "DevOps & Automation",
    icon: <VscAzureDevops className="w-4 h-4" />,
  },
  {
    name: "Automation",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-200 dark:border-teal-800",
    category: "DevOps & Automation",
    icon: <TbAutomation className="w-4 h-4" />,
  },
  {
    name: "Make.com",
    color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800",
    category: "Tools",
    icon: <SiMake className="w-4 h-4" />,
  },
  // Tools
  {
    name: "Android Studio",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800",
    category: "Tools",
    icon: <SiAndroidstudio className="w-4 h-4" />,
  },
  {
    name: "VS Code",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    category: "Tools",
    icon: <VscVscode className="w-4 h-4" />,
  },
  {
    name: "Antigravity",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800",
    category: "Tools",
    icon: <TbSparkles className="w-4 h-4" />,
  },
];

export default function Skills() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? skills : skills.filter((s) => s.category === active);

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

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              {cat}
              {active === cat && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div layout className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => (
              <motion.span
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm cursor-default transition-shadow hover:shadow-md ${skill.color}`}
              >
                {skill.icon}
                {skill.name}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
