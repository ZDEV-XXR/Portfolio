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
    techStack: ["Next.js 14", "Tailwind CSS", "Framer Motion"],
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
  {
    id: "4",
    title: "Upwork Job Radar ( staged to be published )",
    description: "Upwork Job Radar is a Chrome extension that helps freelancers stay updated on the latest job postings on Upwork. It provides real-time notifications for new job listings based on user-defined criteria, allowing freelancers to quickly respond to relevant opportunities and increase their chances of securing projects.",
    techStack: ["HTML5 & CSS3", "JavaScript", "Manifest V3 (MV3)"],
    githubUrl: "https://github.com/ZDEV-XXR/Upwork-Job-Radar",
    demoUrl: "https://chromewebstore.google.com/detail/upwork-job-radar/bcddocmbchgocihecaagkhneoegoldda?authuser=1&hl=en",
    image: "./Assets/upworkradar.png",
    category: "Web"
  }
];