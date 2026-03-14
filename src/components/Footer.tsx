export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Portfolio. Built with Next.js & Tailwind
          CSS.
        </p>
        <p className="text-xs text-gray-600">
          Auto-updated by AI Agent
        </p>
      </div>
    </footer>
  );
}
