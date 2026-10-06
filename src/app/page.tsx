import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import AbleTo from "@/src/components/sections/AbleTo";
import Skills from "@/src/components/sections/Skills";
import Projects from "@/src/components/sections/Projects";
import Contact from "@/src/components/sections/Contact";

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

        {/* What I Can Do & Build
            <AbleTo />
            */}

        {/* Projects */}
            <Projects />

        {/* Contact */}
            <Contact />
    </main>
  );
}
