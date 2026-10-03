'use client';
import {useEffect, useState} from "react";
import { fetchProjects } from "@/src/api/api";
import ProjectCard from "@/src/components/Projects/ProjectsCard";
import ProjectPreview from "@/src/components/Projects/ProjectPreview";


interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    techStack: string[] | string | null;
    githubUrl?: string;
    apkUrl?: string;
    externalUrl?: string;
    category: "Web" | "Mobile" | "Automation";
    created_at?: string;
}

export default function ListProjects() {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        void fetchProjects(setError, setLoading, setProjects);
    }, []);

    const handleProjectClick = (project: Project): void => {
        setSelectedProject(project);
    };

return (
    // list all projects in a grid with a loading spinner while fetching data
    <div>
        {loading && (
            <div role="status" aria-label="Loading projects" className="flex h-40 items-center justify-center">
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600/20 border-t-indigo-600" />
            </div>
        )}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <ProjectCard
                        onClick={() => handleProjectClick(project)}
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        techStack={project.techStack}
                        githubUrl={project.githubUrl}
                    />
                ))}
            </div>
        )}
        {selectedProject && (
            <ProjectPreview
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        )}
    </div>
    );
}
