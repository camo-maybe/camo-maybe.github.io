import { ProfileData } from "../types";

export default function Hero({ profile }: { profile: ProfileData }) {
  const hasName = profile.name.length > 0;

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <div className="text-center px-6 max-w-3xl">
        {/* Avatar placeholder */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-purple-500/25">
          <span className="text-3xl font-bold text-white">
            {hasName ? profile.name[0].toUpperCase() : "?"}
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
          {hasName ? profile.name : "Portfolio"}
        </h1>

        {profile.title && (
          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-6">
            {profile.title}
          </p>
        )}

        {profile.bio && (
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            {profile.bio}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-medium bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          {profile.links.email && (
            <a
              href={`mailto:${profile.links.email}`}
              className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              Contact
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
