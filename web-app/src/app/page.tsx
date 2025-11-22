import { AnalysisFormWrapper } from '@/components/dashboard/analysis-form-wrapper';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f111a] text-gray-300 p-4 md:p-8 font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#3b82f615,transparent)] pointer-events-none"></div>

      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#00ff00]"></div>
            <span className="text-xs font-mono text-green-400 tracking-widest uppercase">System Online</span>
          </div>
          <h1 className="font-headline text-4xl font-bold md:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Analyze Content
          </h1>
          <p className="mt-4 text-lg text-gray-400 md:text-xl max-w-2xl">
            Upload text, URLs, or media to verify their accuracy using our
            advanced <span className="text-blue-400 font-semibold">AI detection</span>.
          </p>
        </div>

        <div className="mt-6">
          <AnalysisFormWrapper />
        </div>
      </div>
    </main>
  );
}
