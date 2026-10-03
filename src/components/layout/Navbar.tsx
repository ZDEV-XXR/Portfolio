"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export type SectionId = "home" | "skills" | "projects" | "contact";

export interface NavSectionItem {
  id: SectionId;
  label: string;
  path: string;
}

export const NAV_SECTIONS: NavSectionItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "skills", label: "Skills", path: "/#skills" },
  { id: "projects", label: "Projects", path: "/#projects" },
  { id: "contact", label: "Contact Me", path: "/#contact" },
];

const HASH_TO_SECTION: Record<string, SectionId> = {
  "": "home",
  "#": "home",
  "#skills": "skills",
  "#projects": "projects",
  "#contact": "contact",
};

const SECTION_TO_PATH: Record<SectionId, string> = {
  home: "/",
  skills: "/#skills",
  projects: "/#projects",
  contact: "/#contact",
};

function useSectionNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const isManualScrolling = useRef(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHomeRoute = pathname === "/";

  // Smooth scroll to target section
  const scrollToSection = useCallback((sectionId: SectionId) => {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  // Handle clicking a navigation item
  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: SectionId, path: string) => {
      e.preventDefault();

      if (!isHomeRoute) {
        router.push(path);
        return;
      }

      isManualScrolling.current = true;
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
      manualTimeoutRef.current = setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);

      setActiveSection(sectionId);

      if (window.location.hash !== (sectionId === "home" ? "" : `#${sectionId}`)) {
        window.history.pushState(null, "", path);
      }

      scrollToSection(sectionId);
    },
    [isHomeRoute, router, scrollToSection]
  );

  // Handle initial page load / hash navigation
  useEffect(() => {
    if (!isHomeRoute) return;

    const hash = window.location.hash;
    const targetSection = HASH_TO_SECTION[hash];
    if (targetSection) {
      setActiveSection(targetSection);
      if (targetSection !== "home") {
        const timer = setTimeout(() => {
          scrollToSection(targetSection);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isHomeRoute, scrollToSection]);

  // Handle browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const targetSection = HASH_TO_SECTION[hash] || "home";
      setActiveSection(targetSection);
      scrollToSection(targetSection);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [scrollToSection]);

  // Scroll spy: Update active section and URL hash on user scroll
  useEffect(() => {
    if (!isHomeRoute) return;

    const sections: SectionId[] = ["home", "skills", "projects", "contact"];
    let throttleTimeout: NodeJS.Timeout | null = null;

    const checkActiveSection = () => {
      if (isManualScrolling.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        if (window.location.hash !== "#contact") {
          window.history.replaceState(null, "", SECTION_TO_PATH.contact);
        }
        return;
      }

      if (scrollY < 120) {
        setActiveSection("home");
        if (window.location.hash !== "") {
          window.history.replaceState(null, "", SECTION_TO_PATH.home);
        }
        return;
      }

      const viewportMid = scrollY + windowHeight * 0.35;
      let currentSection: SectionId = "home";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportMid >= top && viewportMid < top + height) {
            currentSection = id;
            break;
          }
        }
      }

      setActiveSection(currentSection);
      const targetPath = SECTION_TO_PATH[currentSection];
      const targetHash = currentSection === "home" ? "" : `#${currentSection}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, "", targetPath);
      }
    };

    const handleScroll = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        checkActiveSection();
        throttleTimeout = null;
      }, 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [isHomeRoute]);

  return { activeSection, handleNavClick };
}

const ICONS: Record<SectionId, (props: { className?: string }) => React.ReactNode> = {
  home: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  skills: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  projects: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  contact: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
};

export default function Navbar() {
  const [showCV, setShowCV] = useState(false);
  const { activeSection, handleNavClick } = useSectionNavigation();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 w-full"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 relative">
          <nav className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-5 sm:px-6 py-3 shadow-sm">
            {/* Logo / Name */}
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "home", "/")}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group flex items-center"
            >
              Hamza Lemghari
              <span className="text-indigo-500 transition-transform duration-200 group-hover:scale-125">
                .
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 md:gap-2">
              <ul className="flex items-center gap-1">
                {NAV_SECTIONS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <li key={link.id} className="relative">
                      <Link
                        href={link.path}
                        onClick={(e) => handleNavClick(e, link.id, link.path)}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 block ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="desktop-active-pill"
                            className="absolute inset-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 -z-10 shadow-sm"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="ml-2 pl-3 border-l border-slate-200 dark:border-slate-800 flex items-center gap-2">
                {/* View CV Button - Desktop */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowCV(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/30 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View CV
                </motion.button>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Header Controls (Top right) */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setShowCV(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/25 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                CV
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Floating Bottom Navigation Dock for Mobile / Small Screens */}
      <motion.nav
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center gap-1 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-1.5 shadow-2xl shadow-slate-900/15 dark:shadow-black/50">
          {NAV_SECTIONS.map((link) => {
            const isActive = activeSection === link.id;
            const Icon = ICONS[link.id];

            return (
              <Link
                key={link.id}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.id, link.path)}
                className={`relative flex flex-col items-center justify-center px-3.5 py-1.5 rounded-full transition-all duration-200 min-w-[64px] ${
                  isActive
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-dock-pill"
                    className="absolute inset-0 rounded-full bg-indigo-600 shadow-md shadow-indigo-500/35 -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                <span
                  className={`text-[10px] tracking-tight mt-0.5 leading-none ${
                    isActive ? "font-bold text-white" : "font-medium"
                  }`}
                >
                  {link.label === "Contact Me" ? "Contact" : link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* CV Modal */}
      <AnimatePresence>
        {showCV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
              onClick={() => setShowCV(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    Hamza Lemghari — CV
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://drive.google.com/uc?export=download&id=1dkViZdUIBjSDtk1L7g5HE3jPMwSQFSIs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </a>
                  <button
                    onClick={() => setShowCV(false)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/* PDF Viewer */}
              <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950">
                <iframe
                  src="https://drive.google.com/file/d/1dkViZdUIBjSDtk1L7g5HE3jPMwSQFSIs/preview"
                  className="w-full h-full border-none"
                  title="Hamza Lemghari CV Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
