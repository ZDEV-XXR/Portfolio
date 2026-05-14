import FeaturedProjects from "@/src/components/FeaturedProjects";
import Hero from "@/src/components/Hero";
import About from "@/src/components/About";
import Skills from "@/src/components/Skills";
import Contact from "@/src/components/Contact";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      {/* Home */}
      <section id="home">
        <Hero />
      </section>

      {/* About */}
      <section id="about">
        <About />
      </section>

      {/* Skills */}
      <section id="skills">
        <Skills />
      </section>

      {/* Projects */}
      <FeaturedProjects />

      {/* Contact */}
      <Contact />
    </main>
  );
}