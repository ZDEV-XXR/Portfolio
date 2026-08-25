import FeaturedProjects from "@/src/components/Projects/FeaturedProjects";
import Hero from "@/src/components/Home/Hero";
import About from "@/src/components/Home/Body/About";
import Skills from "@/src/components/Skills/Skills";
import Contact from "@/src/components/ContactMe/Contact";

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