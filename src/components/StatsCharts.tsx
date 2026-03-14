"use client";

interface PieChartProps {
  label: string;
  data: { [key: string]: number };
  colors: string[];
}

function PieChart({ label, data, colors }: PieChartProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const items = Object.entries(data);
  let currentPercentage = 0;

  return (
    <div className="flex flex-col items-center bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/50 group">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 group-hover:text-white transition-colors">
        {label}
      </h3>
      <div className="relative w-32 h-32 mb-6">
        <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
          {items.map((item, i) => {
            const percentage = (item[1] / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -currentPercentage;
            currentPercentage += percentage;

            return (
              <circle
                key={i}
                r="16"
                cx="16"
                cy="16"
                fill="transparent"
                stroke={colors[i]}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-in-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-inner">
                <span className="text-[10px] text-slate-500 font-mono">Total</span>
            </div>
        </div>
      </div>
      <div className="w-full space-y-2">
        {items.map((item, i) => {
          const percent = Math.round((item[1] / total) * 100);
          return (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                <span className="text-slate-400 font-medium">{item[0]}</span>
              </div>
              <span className="text-white font-bold">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StatsCharts({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PieChart 
        label="Methodology" 
        data={stats.methodology} 
        colors={["#3b82f6", "#a855f7"]} // Blue to Purple
      />
      <PieChart 
        label="Version Control" 
        data={stats.vcs} 
        colors={["#ec4899", "#f59e0b"]} // Pink to Orange
      />
      <PieChart 
        label="Work Stack" 
        data={stats.stack} 
        colors={["#10b981", "#3b82f6"]} // Emerald to Blue
      />
    </div>
  );
}
