import {FaAndroid, FaExternalLinkAlt, FaGithub, FaHeartbeat} from "react-icons/fa";
import type {IconType} from "react-icons";
import type {MouseEventHandler} from "react";
import {normalizeTechStack} from "@/src/components/Projects/techStack";

interface ProjectCardProps {
    title: string,
    description: string,
    image: string,
    techStack?: string[] | string | null,
    githubUrl?: string,
    apkUrl?: string,
    externalUrl?: string,
    statusUrl?: string,
    onClick?: MouseEventHandler<HTMLDivElement>
}

interface ProjectLink {
    label: string;
    href: string;
    icon: IconType;
}

export default function ProjectCard({
        title, description, image, techStack, githubUrl, apkUrl, externalUrl, statusUrl, onClick
}: ProjectCardProps) {
    const technologies = normalizeTechStack(techStack);
    const links: ProjectLink[] = [
        ...(githubUrl ? [{label: "Source code", href: githubUrl, icon: FaGithub}] : []),
        ...(externalUrl ? [{label: "Visit project", href: externalUrl, icon: FaExternalLinkAlt}] : []),
        ...(apkUrl ? [{label: "Download APK", href: apkUrl, icon: FaAndroid}] : []),
        ...(statusUrl ? [{label: "System status", href: statusUrl, icon: FaHeartbeat}] : []),
    ];

    return (
        // handle onClick if provided, otherwise do nothing
        <div onClick={onClick} className="cursor-pointer">
        <article
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:shadow-black/20">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {image ? (
                    <img
                        src={image}
                        alt={`${title} project preview`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950"
                    >
                        <span className="text-5xl font-bold tracking-tight text-slate-400/70 dark:text-slate-500/70">
                            {title.slice(0, 1).toUpperCase()}
                        </span>
                    </div>
                )}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-70"
                />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        {title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {description}
                    </p>
                    {technologies.length > 0 && (
                        <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-2">
                            {technologies.map((tech) => (
                                    <li
                                        key={tech}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                                    >
                                        {tech}
                                    </li>
                                )
                            )}

                        </ul>
                    )}
                </div>

                {links.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        {links.map(({label, href, icon: Icon}) => {
                            const isExternal = !href.startsWith("/");

                            return (
                                <a
                                    key={label}
                                    href={href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900"
                                >
                                    <Icon aria-hidden="true" className="h-3.5 w-3.5"/>
                                    {label}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </article>
        </div>
    );
}
