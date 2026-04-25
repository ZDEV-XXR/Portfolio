import { projects } from "@/src/data/projects";
import ProjectCard from "@/src/components/ProjectCard";
import Hero from "@/src/components/Hero";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      <Hero />
      
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}