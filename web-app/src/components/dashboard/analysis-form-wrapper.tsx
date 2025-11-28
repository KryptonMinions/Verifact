
'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleTextAnalysis } from '@/app/actions';
import { AnalysisForm } from './analysis-form';
import { AnalysisResultsContainer } from './analysis-results-container';
import { ReverseImageTimeline } from './reverse-image-timeline';
import type { AnalysisResult } from '@/types';
import { useActionState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function AnalysisFormWrapper() {
  const [state, formAction, isPending] = useActionState(handleTextAnalysis, {
    result: null,
    error: null,
  });

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState<AnalysisResult | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    if (isPending) {
      setShowResult(null);
      setShowTimeline(false);
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
    if (state.result) {
      setShowResult(state.result);
      formRef.current?.reset();

      // Auto-show timeline if RIS data exists
      if (state.result.reverse_image_search_data) {
        setShowTimeline(true);
      }

      // Give time for state to update and DOM to re-render before scrolling
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [state, isPending, toast]);

  const handleCollapseTimeline = () => {
    setShowTimeline(false);
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
      <div className="w-full">
        <AnimatePresence mode="wait">
          {showTimeline && showResult?.reverse_image_search_data ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReverseImageTimeline
                data={showResult.reverse_image_search_data}
                onCollapse={handleCollapseTimeline}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalysisForm
                formAction={formAction}
                formRef={formRef}
                isPending={isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full">
        <AnalysisResultsContainer result={showResult} isPending={isPending} ref={resultRef} />
      </div>
    </div>
  );
}
