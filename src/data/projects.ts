import { Url } from "next/dist/shared/lib/router/router";
import RootLayout from "../app/layout";
import Status from "@/src/app/Status"

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  apkUrl?: string;
  extUrl?: string;
  statusUrl?: string;
  image: string;
  category: 'Web' | 'Mobile' | 'Automation';
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website ( This )",
    description: "A personal portfolio showcasing my projects and skills, built with Next.js, Tailwind CSS, and Framer Motion animations.",
    techStack: ["Next.js 14", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/ZDEV-XXR/Portfolio",
    image: "./assets/po.jpg",
    category: "Web"
  },
  {
    id: "2",
    title: "Instant News",
    description: "A high-performance Android news aggregator that fetches real-time global headlines. Implemented custom caching logic to allow offline reading and utilized Retrofit for seamless API integration.",
    techStack: ["Android", "Jetpack Compose", "Firebase", "Kotlin", "Retrofit"],
    githubUrl: "https://github.com/ZDEV-XXR/InstantNews",
    apkUrl: "./downloads/instantnews.apk",
    image: "./assets/in.png",
    category: "Mobile"
  },
  {
    id: "3",
    title: "DocReader",
    description: "Read, scan Documents",
    techStack: ["Android", "Jetpack Compose", "Kotlin"],
    githubUrl: "https://github.com/ZDEV-XXR/DocReader",
    apkUrl: "./downloads/docreader.apk",
    image: "./assets/dr.png",
    category: "Mobile"
  },
  {
    id: "4",
    title: "Upwork Job Radar",
    description: "Upwork Job Radar is a Chrome extension that helps freelancers stay updated on the latest job postings on Upwork. It provides real-time notifications for new job listings based on user-defined criteria, allowing freelancers to quickly respond to relevant opportunities and increase their chances of securing projects.",
    techStack: ["HTML5 & CSS3", "JavaScript", "Manifest V3 (MV3)"],
    githubUrl: "https://github.com/ZDEV-XXR/Upwork-Job-Radar",
    extUrl: "https://chromewebstore.google.com/detail/upwork-job-radar/bcddocmbchgocihecaagkhneoegoldda?authuser=1&hl=en",
    image: "./assets/ur.png",
    category: "Web"
  },
  {
    id: "5",
    title: "Automated Service Heartbeat Tracker",
    description: "An automated monitoring system that tracks website health every 12 Hours, instantly logging downtime to a cloud database and firing developer alerts on failure.",
    techStack: ["MAKE.COM", "HTTP APIs", "SUPABASE", "WEBHOOKS"],
    extUrl: "",
    statusUrl: "/status",
    image: "./assets/do.jpg",
    category: "Automation"
  }
];