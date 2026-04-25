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
    title: "Instant News",
    description: "A high-performance Android news aggregator that fetches real-time global headlines. Implemented custom caching logic to allow offline reading and utilized Retrofit for seamless API integration.",
    techStack: ["Android", "Jetpack Compose", "Firebase", "Kotlin", "Retrofit"],
    githubUrl: "https://github.com/ZDEV-XXR/InstantNews",
    demoUrl: "https://portal.testapp.io/apps/install/rQ8RQ16xxObpW",
    image: "./Assets/instantNews.png",
    category: "Mobile"
  },
  {
    id: "2",
    title: "DocReader",
    description: "App Description",
    techStack: ["Android", "Jetpack Compose", "Kotlin"],
  githubUrl: "https://www.google.com/",
    demoUrl: "https://www.google.com/",
    image: "https://picsum.photos/id/104/400/200",
    category: "Mobile"
  },
];