"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center py-20
    text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold tracking-tight text-slate-900 text-white"
      >
        HI, I'M HAMZA
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-lg text-slate-100 max-w-2xl text-slate-400"
      >
        I'm a Web & Mobile Developer specializing in Kotlin, React and Next.js, 
        building clean, performant applications.
      </motion.p>
    </section>
  );
}