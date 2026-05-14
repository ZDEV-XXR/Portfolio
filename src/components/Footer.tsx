export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Hamza Lemghari. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a
            href="https://github.com/ZDEV-XXR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110"
          >
            <span className="sr-only">GitHub</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/hamza-lemghari-96844b305/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110"
          >
            <span className="sr-only">LinkedIn</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
