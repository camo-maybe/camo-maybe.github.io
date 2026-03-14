import { WorkProject } from "../types";

export default function Timeline({ experience }: { experience: WorkProject[] }) {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
      {experience.map((item, index) => (
        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-300 group-hover:border-blue-500 group-hover:text-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10">
            <svg className="fill-current" viewBox="0 0 12 12" width="12" height="12">
              <path d="M11 4H1V1h10v3zM1 6h10v3H1V6z" />
            </svg>
          </div>
          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-slate-700 group-hover:bg-slate-800/50">
            <div className="flex items-center justify-between space-x-2 mb-2">
              <div className="font-bold text-white text-lg">{item.name}</div>
              <time className="font-mono text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg shrink-0">
                {item.date} - {item.endDate}
              </time>
            </div>
            
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-4 transition-colors group-hover:bg-slate-700/50 group-hover:text-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Role: {item.role}
            </div>
            {item.description && (
               <p className="text-slate-500 text-xs mt-2 italic">
                 {item.description}
               </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-800/50 border border-slate-700 text-[10px] text-slate-400 group-hover:text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
