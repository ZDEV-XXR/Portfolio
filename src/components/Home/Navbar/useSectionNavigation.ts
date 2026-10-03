"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export type SectionId = "home" | "skills" | "projects" | "contact";

export interface NavSectionItem {
  id: SectionId;
  label: string;
  path: string;
}

export const NAV_SECTIONS: NavSectionItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "skills", label: "Skills", path: "/skills" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "contact", label: "Contact Me", path: "/contact" },
];

const ROUTE_TO_SECTION: Record<string, SectionId> = {
  "/": "home",
  "/skills": "skills",
  "/projects": "projects",
  "/contact": "contact",
  "/contact-me": "contact",
  "/about": "home",
};

const SECTION_TO_ROUTE: Record<SectionId, string> = {
  home: "/",
  skills: "/skills",
  projects: "/projects",
  contact: "/contact",
};

export function useSectionNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    return ROUTE_TO_SECTION[pathname] || "home";
  });

  const isManualScrolling = useRef(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHomeRoute = Boolean(ROUTE_TO_SECTION[pathname]);

  // Smooth scroll to target section
  const scrollToSection = useCallback((sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Handle clicking a navigation item
  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: SectionId, path: string) => {
      e.preventDefault();

      if (!isHomeRoute) {
        // If on another route like /add or /status, navigate to the target route
        router.push(path);
        return;
      }

      // Mark that user triggered scrolling
      isManualScrolling.current = true;
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
      manualTimeoutRef.current = setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);

      setActiveSection(sectionId);

      // Update URL route without full reload
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }

      scrollToSection(sectionId);
    },
    [isHomeRoute, router, scrollToSection]
  );

  // Handle initial page load / deep linking (e.g. visiting /skills directly)
  useEffect(() => {
    if (!isHomeRoute) return;

    const targetSection = ROUTE_TO_SECTION[pathname];
    if (targetSection) {
      setActiveSection(targetSection);

      if (targetSection !== "home") {
        // Small delay to allow DOM hydration
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
      const currentPath = window.location.pathname;
      const targetSection = ROUTE_TO_SECTION[currentPath];
      if (targetSection) {
        setActiveSection(targetSection);
        scrollToSection(targetSection);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [scrollToSection]);

  // Scroll spy: Update active section and URL on user scroll
  useEffect(() => {
    if (!isHomeRoute) return;

    const sections: SectionId[] = ["home", "skills", "projects", "contact"];
    let throttleTimeout: NodeJS.Timeout | null = null;

    const checkActiveSection = () => {
      if (isManualScrolling.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom of page: highlight Contact
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        if (window.location.pathname !== SECTION_TO_ROUTE.contact) {
          window.history.replaceState(null, "", SECTION_TO_ROUTE.contact);
        }
        return;
      }

      // Top of page: highlight Home
      if (scrollY < 120) {
        setActiveSection("home");
        if (window.location.pathname !== SECTION_TO_ROUTE.home) {
          window.history.replaceState(null, "", SECTION_TO_ROUTE.home);
        }
        return;
      }

      // Find section currently in the viewport (midpoint)
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
      const targetRoute = SECTION_TO_ROUTE[currentSection];
      if (window.location.pathname !== targetRoute) {
        window.history.replaceState(null, "", targetRoute);
      }
    };

    const handleScroll = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        checkActiveSection();
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [isHomeRoute]);

  return {
    activeSection,
    handleNavClick,
    isHomeRoute,
  };
}
