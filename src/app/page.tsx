import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import SkillBadge from "../components/SkillBadge";
import Timeline from "../components/Timeline";
import StatsCharts from "../components/StatsCharts";
import Footer from "../components/Footer";
import portfolioData from "../data/projects.json";
import skillDurations from "../data/skills.json";
import experienceData from "../data/experience.json";
import statsData from "../data/stats.json";
import type { PortfolioData, WorkProject } from "../types";

const data = portfolioData as PortfolioData;
const experience = experienceData as WorkProject[];

// Merge durations into skills
const skillsWithDuration = data.skills.map(skill => ({
  ...skill,
  months: (skillDurations as Record<string, number>)[skill.name] || 0
}));

// Group skills by category
const categories = ["Language", "Framework", "Cloud", "AI", "IaC", "CI/CD", "Library"];
const groupedSkills = categories.map(cat => ({
  name: cat,
  skills: skillsWithDuration
    .filter(s => s.category === cat)
    .sort((a, b) => (b.months || 0) - (a.months || 0))
})).filter(g => g.skills.length > 0);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero profile={data.profile} />

      {/* Skills */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
        </div>
        
        <div className="space-y-12">
          {groupedSkills.map((group) => (
            <div key={group.name} className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">
                {group.name}s
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Stats */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Career Statistics</h2>
        </div>
        <StatsCharts stats={statsData} />
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
