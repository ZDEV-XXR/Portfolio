"use client";

import { motion } from "framer-motion";
import {
  HiOutlineGlobeAlt,
  HiOutlineDevicePhoneMobile,
  HiOutlineServerStack,
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

interface Capability {
  title: string;
  tagline: string;
  icon: IconType;
  accent: string;
  deliverables: string[];
  tech: string[];
}

const CAPABILITIES: Capability[] = [
  {
    title: "Full-Stack Web Applications",
    tagline:
      "End-to-end web platforms engineered for high performance, smooth interactivity, and scale.",
    icon: HiOutlineGlobeAlt,
    accent:
      "text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 dark:text-sky-400",
    deliverables: [
      "Custom SaaS platforms & business portals",
      "Interactive analytics & admin dashboards",
      "SSR/SSG architecture with SEO optimization",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Mobile App Development",
    tagline:
      "Cross-platform mobile applications delivering native responsiveness on both iOS & Android.",
    icon: HiOutlineDevicePhoneMobile,
    accent:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
    deliverables: [
      "Cross-platform iOS & Android releases",
      "Offline sync & resilient local storage",
      "Fluid gesture navigation & micro-interactions",
    ],
    tech: ["React Native", "Expo", "Mobile UI", "REST APIs"],
  },
  {
    title: "Backends & API Architecture",
    tagline:
      "Secure, scalable server architectures and databases capable of handling heavy concurrency.",
    icon: HiOutlineServerStack,
    accent:
      "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400",
    deliverables: [
      "RESTful & modern API design",
      "Relational schema modeling & migrations",
      "Secure auth (JWT/OAuth) & role-based permissions",
    ],
    tech: ["Node.js", "Django", "PostgreSQL", "Supabase"],
  },
  /*{
    title: "AI Integration & Automation",
    tagline:
      "Empowering products with intelligent AI workflows, automated pipelines, and bots.",
    icon: HiOutlineCpuChip,
    accent:
      "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 dark:text-purple-400",
    deliverables: [
      "LLM integrations & context-aware chatbots",
      "Automated data extraction & web scrapers",
      "Scheduled background jobs & webhook handlers",
    ],
    tech: ["OpenAI API", "Python", "LangChain", "Automation"],
  },*/
  {
    title: "UI/UX & Design Systems",
    tagline:
      "Transforming wireframes into pixel-perfect, accessible, and responsive user interfaces.",
    icon: HiOutlineSparkles,
    accent:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 dark:text-amber-400",
    deliverables: [
      "Figma design translation to production code",
      "Accessible (a11y) & responsive web design",
      "Custom animation & micro-interactions",
    ],
    tech: ["Framer Motion", "Tailwind CSS", "Figma", "Radix UI"],
  },
  /*{
    title: "DevOps & Cloud Deployment",
    tagline:
      "Automated pipelines and containerization ensuring reliable, zero-downtime releases.",
    icon: HiOutlineCloudArrowUp,
    accent:
      "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 dark:text-rose-400",
    deliverables: [
      "Containerized microservices with Docker",
      "Automated CI/CD deployment pipelines",
      "Cloud monitoring & performance optimization",
    ],
    tech: ["Docker", "Vercel", "GitHub Actions", "Linux"],
  },*/
];

export default function AbleTo() {
  return (
    <section id="services" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            What I Can Do & Build
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            From Idea to Production-Ready Product
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Whether you need a complete web platform from scratch, a cross-platform
            mobile application, or intelligent AI automations integrated into your stack,
            here is what I build.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-700/60"
              >
                <div>
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${item.accent}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.tagline}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {item.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <HiOutlineCheckCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400"
                          aria-hidden="true"
                        />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
