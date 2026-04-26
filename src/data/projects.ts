export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  image: string;
  category: 'Web' | 'Mobile';
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website ( This )",
    description: "",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "next-themes"],
    githubUrl: "https://github.com/ZDEV-XXR/Portfolio",
    demoUrl: "",
    image: "./Assets/portfolio.jpg",
    category: "Web"
  },
  {
    id: "2",
    title: "Instant News",
    description: "A high-performance Android news aggregator that fetches real-time global headlines. Implemented custom caching logic to allow offline reading and utilized Retrofit for seamless API integration.",
    techStack: ["Android", "Jetpack Compose", "Firebase", "Kotlin", "Retrofit"],
    githubUrl: "https://github.com/ZDEV-XXR/InstantNews",
    demoUrl: "https://portal.testapp.io/apps/install/6ebVxWXaL4WmA",
    image: "./Assets/instantNews.png",
    category: "Mobile"
  },
  {
    id: "3",
    title: "DocReader ( In Progress )",
    description: "Read, scan Documents",
    techStack: ["Android", "Jetpack Compose", "Kotlin"],
    githubUrl: "https://github.com/ZDEV-XXR/DocReader",
    demoUrl: "",
    image: "./Assets/docReader.png",
    category: "Mobile"
  },
];