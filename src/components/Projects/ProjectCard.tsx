"use client";
import { motion } from "framer-motion";
import { Project } from "@/src/data/projects";
import TechBadge from "./TechBadge";

interface ProjectCardProps {
  project: Project;
  index?: number;
  onClick?: () => void;
}

export default function ProjectCard({ project, index = 0, onClick }: ProjectCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      transition={{ 
        y: { type: "spring", stiffness: 300, damping: 20 },
        scale: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.4, delay: index * 0.1 },
        default: { duration: 0.4 }
      }}
      className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
          {project.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{project.title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>

        <div className="mt-auto pt-6 flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:gap-2 transition-all">
          View Details
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}