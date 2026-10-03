"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
          About Me
        </h2>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm p-8">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            Hi, I&apos;m <span className="font-semibold text-indigo-600 dark:text-indigo-400">Hamza Lemghari</span> — 
            Full-Stack Software Developer & AI Enthusiast.
            I engineer robust web platforms, craft intuitive mobile applications, and explore interactive environments.
            I bridge the gap between creative design and technical execution to build digital experiences that matter.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            I specialize in full-stack development, moving seamlessly from designing UI/UX wireframes in Figma to deploying scalable applications using Next.js, TypeScript, and Django.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
