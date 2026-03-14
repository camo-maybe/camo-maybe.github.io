import { SkillData } from "../types";

const categoryColors: Record<string, string> = {
  Language: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300",
  Cloud: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
  Framework: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300",
  AI: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
  IaC: "from-sky-500/20 to-indigo-500/20 border-sky-500/30 text-sky-300",
  "CI/CD": "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-300",
  Library: "from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-300",
};

export default function SkillBadge({ skill }: { skill: SkillData }) {
  const colors = categoryColors[skill.category] || "from-gray-500/20 to-gray-500/20 border-gray-500/30 text-gray-300";

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r ${colors} border backdrop-blur-sm transition-all duration-300 hover:scale-105`}
    >
      {skill.name}
    </span>
  );
}
