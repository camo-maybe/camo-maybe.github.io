import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import SkillBadge from "../components/SkillBadge";
import Timeline from "../components/Timeline";
import Footer from "../components/Footer";
import portfolioData from "../data/projects.json";
import skillDurations from "../data/skills.json";
import experienceData from "../data/experience.json";
import type { PortfolioData, WorkProject } from "../types";

const data = portfolioData as PortfolioData;
const experience = experienceData as WorkProject[];

// Merge durations into skills
const skillsWithDuration = data.skills.map(skill => ({
  ...skill,
  months: (skillDurations as Record<string, number>)[skill.name]
}));

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero profile={data.profile} />

      {/* Skills */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {skillsWithDuration.map((skill) => (
            <SkillBadge key={skill.name} skill={skill} />
          ))}
        </div>
      </section>

      {/* Experience (Career Timeline) */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Work History</h2>
        </div>
        <Timeline experience={experience} />
      </section>

      {/* Personal Projects */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Personal Projects</h2>
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
