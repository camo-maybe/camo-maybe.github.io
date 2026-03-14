import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import SkillBadge from "../components/SkillBadge";
import Footer from "../components/Footer";
import portfolioData from "../data/projects.json";
import type { PortfolioData } from "../types";

const data = portfolioData as PortfolioData;

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero profile={data.profile} />

      {/* Skills */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Skills</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill) => (
            <SkillBadge key={skill.name} skill={skill} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
