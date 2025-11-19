
'use client';

import { forwardRef } from 'react';
import type { AnalysisResult } from '@/types';
import { AnalysisResults } from './analysis-results';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type AnalysisResultsContainerProps = {
  result: AnalysisResult | null;
  isPending: boolean;
};

const MotionCard = motion(Card);

export const AnalysisResultsContainer = forwardRef<
  HTMLDivElement,
  AnalysisResultsContainerProps
>(({ result, isPending }, ref) => {
  let content;

  if (isPending) {
    content = (
      <MotionCard
        key="loading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8 min-h-[500px] border-2 border-dashed"
      >
        <CardContent className="flex flex-col items-center justify-center">
          <Loader2 className="size-20 animate-spin" />
          <h3 className="mt-4 text-xl font-semibold">Analyzing...</h3>
          <p className="mt-2 text-sm">
            Please wait while we analyze your content.
          </p>
        </CardContent>
      </MotionCard>
    );
  } else if (result) {
    content = (
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <AnalysisResults result={result} />
      </motion.div>
    );
  } else {
    content = (
      <MotionCard
        key="placeholder"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8 min-h-[500px] border-2 border-dashed"
      >
        <CardContent className="flex flex-col items-center justify-center">
          <FileQuestion className="size-20" />
          <h3 className="mt-4 text-xl font-semibold">
            Analysis Results
          </h3>
          <p className="mt-2 text-sm">
            Your analysis results will appear here once you submit content.
          </p>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <div ref={ref} className="h-full">
      <AnimatePresence mode="wait">{content}</AnimatePresence>
    </div>
  );
});

AnalysisResultsContainer.displayName = 'AnalysisResultsContainer';
