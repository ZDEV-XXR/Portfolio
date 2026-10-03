'use client';
import AddProject from "@/src/components/Add New Project/Add/AddProject";
import ProjectsTable from "@/src/components/Add New Project/Add/ProjectsTable";
import {postNewProject} from "@/src/api/api";
import {useState} from "react";
import {useRouter} from "next/navigation";

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


export default function NewPage() {
    const router = useRouter();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [projectsVersion, setProjectsVersion] = useState(0);

    return(
        <>
            <AddProject
                onSubmit={async (project) => {
                    await postNewProject(project);
                    setProjectsVersion((version) => version + 1);
                }}
            />
            <ProjectsTable
                key={projectsVersion}
                onAdd={() => router.push("/add")}
                onEdit={(project) => setSelectedProject(project)}
                onDelete={(project) => setProjectToDelete(project)}
            />
        </>
    );
}