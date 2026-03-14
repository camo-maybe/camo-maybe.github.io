import { ProjectData } from "../types";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "In Development": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="group relative bg-gray-900/40 rounded-2xl border border-white/5 hover:border-white/15 p-6 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1">
      {/* Category & Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {project.category}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[project.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
        >
          {project.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-5">
        {project.description}
      </p>

      {/* Highlights */}
      <ul className="space-y-2 mb-5">
        {project.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
            {h}
          </li>
        ))}
      </ul>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 border border-white/5"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Decorative corner glow */}
      <div className="absolute -top-px -right-px w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
