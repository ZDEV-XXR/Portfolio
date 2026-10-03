import Hero from "@/src/components/Home/Hero";
import About from "@/src/components/Home/Body/About";
import Skills from "@/src/components/Skills/Skills";
import Contact from "@/src/components/ContactMe/Contact";
import ListProjects from "@/src/components/Projects/ListProjects";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 md:pb-12">
      {/* Home / Hero */}
      <section id="home">
        <Hero />
      </section>

      {/* About */}
      <section id="about">
        <About />
      </section>

      {/* Skills */}
      <Skills />

      {/* Projects */}
      <section id="projects" className="py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
            Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            A showcase of web, mobile, and automated applications I&apos;ve engineered.
          </p>
        </div>
        <ListProjects />
      </section>

      {/* Contact */}
      <Contact />
    </main>
  );
}
