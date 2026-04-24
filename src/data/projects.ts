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
    techStack: ["Android Studio", "Firebase", "Kotlin","Retrofit"],
    githubUrl: "https://github.com/ZDEV-XXR/InstantNews",
    demoUrl: "https://youtube.com/",
    image: "/assets/instant-news.png",
    category: "Mobile"
  },
];