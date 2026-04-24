"use client";
import { motion } from "framer-motion";
import { Project } from "@/src/data/projects";
import TechBadge from "./TechBadge";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all"
    >
      {/* Project Image/Mockup */}
      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="object-cover w-full h-full transition-transform hover:scale-110 duration-500 opacity-90 hover:opacity-100"
        />
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-slate-300 border border-slate-700 uppercase tracking-wider">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white tracking-tight">{project.title}</h3>
        <p className="mt-2 text-slate-400 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:text-white transition-all"
          >
            GitHub
          </a>
          {project.demoUrl && (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}