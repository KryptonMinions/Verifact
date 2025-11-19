import { AnalysisFormWrapper } from '@/components/dashboard/analysis-form-wrapper';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col">
          <h1 className="font-headline text-4xl font-semibold md:text-5xl">
            Analyze Content for Misinformation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Upload text, URLs, or media to verify their accuracy using our
            advanced AI detection.
          </p>
        </div>
        <div className="mt-10">
          <AnalysisFormWrapper />
        </div>
      </div>
    </main>
  );
}
