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
            a passionate Web &amp; Mobile Developer who loves building clean, 
            performant applications. I specialize in modern front-end frameworks, 
            Android development with Kotlin and Jetpack Compose, and creating 
            tools that solve real-world problems.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            Whether it&apos;s crafting pixel-perfect UIs, building RESTful APIs, 
            or developing browser extensions — I enjoy the full spectrum of 
            software development. I&apos;m always exploring new technologies and 
            looking for opportunities to grow.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
